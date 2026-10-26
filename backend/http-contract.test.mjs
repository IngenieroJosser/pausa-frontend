import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
import test from "node:test";
import { createAssessmentService } from "./assessment-service.mjs";
import { createDatabase } from "./database.mjs";
import { createHttpHandler } from "./http-app.mjs";

async function setup() {
  const database = createDatabase(":memory:");
  const server = createServer(createHttpHandler(createAssessmentService(database)));
  await new Promise((resolve) => server.listen(0,"127.0.0.1",resolve));
  return { base:`http://127.0.0.1:${server.address().port}`,async close(){
    await new Promise((resolve) => server.close(resolve));database.close();
  }};
}
const auth=(token,body)=>({method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify(body)});
async function create(base,goal="empleo"){
  const response=await fetch(`${base}/api/v1/sessions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({goal,friction:"oportunidad"})});
  assert.equal(response.status,201);return response.json();
}
const decide=(base,session,scenarioId,choiceId,requestId=randomUUID(),extra={})=>fetch(`${base}/api/v1/sessions/${session.id}/decisions`,auth(session.accessToken,{requestId,scenarioId,choiceId,...extra}));
async function details(base,session){return fetch(`${base}/api/v1/sessions/${session.id}`,{headers:{Authorization:`Bearer ${session.accessToken}`}}).then(r=>r.json());}

test("session has opaque token and a stable personalized initial case",async()=>{
  const ctx=await setup();try{
    const session=await create(ctx.base,"datos");
    assert.match(session.accessToken,/^[A-Za-z0-9_-]{40,}$/);
    const state=await details(ctx.base,session);
    assert.equal(state.nextScenario.id,session.nextScenario.id);
    assert.equal("accessToken" in state,false);
    assert.ok(state.nextScenario.id.startsWith("datos-"));
  }finally{await ctx.close()}
});

test("no access with someone else's bearer token",async()=>{
  const ctx=await setup();try{
    const owner=await create(ctx.base),stranger=await create(ctx.base);
    const get=await fetch(`${ctx.base}/api/v1/sessions/${owner.id}`,{headers:{Authorization:`Bearer ${stranger.accessToken}`}});
    const post=await fetch(`${ctx.base}/api/v1/sessions/${owner.id}/decisions`,auth(stranger.accessToken,{requestId:randomUUID(),scenarioId:owner.nextScenario.id,choiceId:"verify"}));
    assert.equal(get.status,403);assert.equal(post.status,403);
  }finally{await ctx.close()}
});

test("cannot submit client-supplied correct flag",async()=>{
  const ctx=await setup();try{
    const session=await create(ctx.base);
    const bad=await decide(ctx.base,session,session.nextScenario.id,"impulse",randomUUID(),{isCorrect:true});
    assert.equal(bad.status,400);assert.equal((await details(ctx.base,session)).decisionCount,0);
  }finally{await ctx.close()}
});

test("idempotency survives retry and conflicting reuse is rejected",async()=>{
  const ctx=await setup();try{
    const session=await create(ctx.base),id=randomUUID();
    const first=await decide(ctx.base,session,session.nextScenario.id,"verify",id);
    const replay=await decide(ctx.base,session,session.nextScenario.id,"verify",id);
    const conflict=await decide(ctx.base,session,session.nextScenario.id,"impulse",id);
    assert.equal(first.status,201);assert.equal(replay.status,201);
    assert.equal((await replay.json()).replayed,true);assert.equal(conflict.status,409);
  }finally{await ctx.close()}
});

test("concurrent decisions create only one state transition",async()=>{
  const ctx=await setup();try{
    const session=await create(ctx.base);
    const responses=await Promise.all([
      decide(ctx.base,session,session.nextScenario.id,"verify"),
      decide(ctx.base,session,session.nextScenario.id,"impulse")
    ]);
    assert.deepEqual(responses.map(r=>r.status).sort(),[201,409]);
    assert.equal((await details(ctx.base,session)).decisionCount,1);
  }finally{await ctx.close()}
});

test("future cases remain protected and completing is idempotent",async()=>{
  const ctx=await setup();try{
    const session=await create(ctx.base);
    const future=await fetch(`${ctx.base}/api/v1/scenarios/dinero-01-t?sessionId=${session.id}`,{headers:{Authorization:`Bearer ${session.accessToken}`}});
    assert.equal(future.status,403);
    for(let i=0;i<3;i++){
      const state=await details(ctx.base,session);
      const response=await decide(ctx.base,session,state.nextScenario.id,"verify");
      assert.equal(response.status,201);
    }
    const first=await fetch(`${ctx.base}/api/v1/sessions/${session.id}/complete`,auth(session.accessToken,{}));
    const second=await fetch(`${ctx.base}/api/v1/sessions/${session.id}/complete`,auth(session.accessToken,{}));
    assert.equal(first.status,200);assert.equal(second.status,200);
    assert.deepEqual(await second.json(),await first.json());
  }finally{await ctx.close()}
});

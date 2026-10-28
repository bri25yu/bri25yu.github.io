# Prerequisites for NeMo Gym infra development

# Table of contents

- [Prerequisites for NeMo Gym infra development](#prerequisites-for-nemo-gym-infra-development)
- [Table of contents](#table-of-contents)
- [Best practices and principles](#best-practices-and-principles)
  - [Software](#software)
    - [The Zen of Python, by Tim Peters](#the-zen-of-python-by-tim-peters)
    - [Annotations](#annotations)
  - [Products](#products)
  - [Miscellaneous suggestions](#miscellaneous-suggestions)
    - [Building bridges for Gym](#building-bridges-for-gym)
    - [Keeping up with high volume of commits](#keeping-up-with-high-volume-of-commits)
- [Code context and design decisions](#code-context-and-design-decisions)
  - [3 core concepts organization and what is missing](#3-core-concepts-organization-and-what-is-missing)
  - [Servers: separate folders, separate venvs](#servers-separate-folders-separate-venvs)
  - [Gym’s native data format: OpenAI Responses and other base types](#gyms-native-data-format-openai-responses-and-other-base-types)
  - [Modeling exercises to regularize our design](#modeling-exercises-to-regularize-our-design)
  - [Connection to RL](#connection-to-rl)
  - [Gym scaling studies](#gym-scaling-studies)
  - [Config system](#config-system)
- [Technical topics](#technical-topics)
  - [The world of model training: SFT, RL, research, and what this means for Gym](#the-world-of-model-training-sft-rl-research-and-what-this-means-for-gym)
  - [Concurrent vs Parallel: all about “frame of reference”](#concurrent-vs-parallel-all-about-frame-of-reference)

**Date of publishing**: 7/21/2026  

# Best practices and principles

This section is a high level summary of the best practices and principles that we will refer back to in the sections below i.e. the sections below serve as examples of the principles listed here. It is useful to mention first so that connections can be drawn later on. Key principles interleaved in the sections below will always be marked in italics with the prefix “*Key principle*:” (you can ctrl+f this).

## Software

Some of the key principles for writing software are well encapsulated within “The Zen of Python” written by Tim Peters (major contributor to Python). First, we include the original with no changes, obtained via an interactive Python interpreter using `import this` (an easter egg similar to `import antigravity`). Then, we discuss several annotations to the original list.

### The Zen of Python, by Tim Peters

Beautiful is better than ugly.  
Explicit is better than implicit.  
Simple is better than complex.  
Complex is better than complicated.  
Flat is better than nested.  
Sparse is better than dense.  
Readability counts.  
Special cases aren't special enough to break the rules.  
Although practicality beats purity.  
Errors should never pass silently.  
Unless explicitly silenced.  
In the face of ambiguity, refuse the temptation to guess.  
There should be one-- and preferably only one \--obvious way to do it.  
Although that way may not be obvious at first unless you're Dutch.  
Now is better than never.  
Although never is often better than \*right\* now.  
If the implementation is hard to explain, it's a bad idea.  
If the implementation is easy to explain, it may be a good idea.  
Namespaces are one honking great idea \-- let's do more of those\!

### Annotations

*Beautiful is better than ugly.*  
*Explicit is better than implicit.*  
We should be careful in which assumptions we make about the knowledge our users have about our systems and software. Generally, having explicit notes, flags, failures, etc are better than hiding things away. Another common example of “implicit” is where data is shown to the user or input by the user, then operated on, and not subsequently re-displayed to the user.

*Simple is better than complex.*  
*Complex is better than complicated.*  
True

*Flat is better than nested.*  
*Sparse is better than dense.*  
*Readability counts.*  
This point can be generalized to be “have semantically organized and well organized code”. For example, when writing test cases we should group them together into test classes to indicate to the reader that all relevant tests are here for reference and there are no hidden or missing tests. Another example, separate semantically distinct blocks of code with an extra newline. Another way I like putting this is “All roads lead to Rome” i.e. there is only one place we need to look or one function we need to use.

*Special cases aren't special enough to break the rules.*  
*Although practicality beats purity.*  
If there is one special case, it typically doesn’t indicate anything. If there are multiple special cases, then we should design to explicitly account for the variation. If there is variation in how a particular segment of software is used, abstract it out. If we expect things to change, abstract it out. “Two points make a line.”

*Errors should never pass silently.*  
*Unless explicitly silenced.*  
This point can be generalized to “be intentional”. If a piece of code is not intended to fail, don’t wrap it in a try/except. However, certain exceptions are intended to be caught and dealt with.

*In the face of ambiguity, refuse the temptation to guess.*  
Buy more time to make an informed design decision by initially doing things adhoc. It also helps to design/implement in a way such that the first iteration of a solution can be adhoc, and as that solution is used more frequently and stabilizes, it can graduate to production.

*There should be one-- and preferably only one \--obvious way to do it.*  
*Although that way may not be obvious at first unless you're Dutch.*  
There is usually one key context or “clever” insight that enables a much simpler solution. For difficult problems, we should be able to look back in hindsight and say that was a good solution. This principle also applies to having strong conventions.

*Now is better than never.*  
*Although never is often better than \*right\* now.*  
I don’t understand this one yet. My best guess is that this is about scoping and having enough information to make an informed design decision.

*If the implementation is hard to explain, it's a bad idea.*  
*If the implementation is easy to explain, it may be a good idea.*  
This is another way to regularize the quality of a design or implementation. Typically if there is too much to explain or it is too messy to explain, it means the underlying design idea is not quite right e.g. many edge cases or conditionals rather than a well-designed schema that is operated on.

*Namespaces are one honking great idea \-- let's do more of those\!*  
I don’t have enough history or enough experience in other programming languages to understand what this means 🤣

## Products

Below is a corresponding set of key principles (significantly less eloquent), not for writing software, but for designing products.

*Close the user loop.*  
Typically there is a structure in corporations where engineers solve problems written by managers or leads who represent the interests of the users. However, the end user use case and context is critical for designing a proper solution that is neither overfit (too specific) or underfit (not helping the user). The ideal case is that engineers solving the problems are able to execute exactly what the downstream users, in order to have firsthand experience in the actual pain point and empathize with the user.

	*Don’t move in silence.*  
Work with users closely and communicate the possible designs and consequences frequently. It will save a lot of time since users will auto reject a lot of possible solutions. And talking more with users will provide additional context to help regularize solutions.

	*Synthesize user feedback into proper solutions.*  
Users are great at telling you that there is a problem or a pain point, but they are typically not reliable for synthesizing solutions. This is because they may not have the same level of experience in system design and/or because they don’t have enough context or information about the existing system to design the right solution for right now.

*Two points make a line.*  
When designing solutions, it’s helpful to have multiple relevant user pain points to help regularize the solution so we avoid overfitting to a single use case and we avoid underfitting where no user benefits from our feature.

	*Solve 90% of the user’s problem in a generic manner and guide them on how to achieve the last specific 10%.*  
Another suggestion on how to avoid overfitting/underfitting. This is what Jonah means when he says “If we only do one thing, we do Nemotron”. Too often is this misinterpreted by engineering managers to be “throw all of my resources at Nemotron”. It is entirely not his point.

*The initial stages of design are identical to that of research.*  
Playing around with possible solutions, see how others solved that problem, searching for key insights that may simplify the problem or solution, etc.

## Miscellaneous suggestions

### Building bridges for Gym

Things I found that helped to build bridges in a way productive for Gym:

1. Think about and design the path forward for supporting environment developers, eventually the goal for each thread is that others have 70-80% knowledge and we have 20-30% (enough to buy time if need be e.g. others are OOO)  
2. For technical discussions, short small group calls as necessary help save time rather than typing on Slack all the time and get face time with other folks. Some things are very difficult to explain over Slack but can be explained in \< 1min voice 🤣  
   1. If we need help but not getting a response, just request a meeting which will help move things forward  
3. Stay concrete. Always assign AIs (helps to stay concrete). I find it helpful to literally write things down so there is no question what happened or what is the next steps  
4. It helps to design the AIs in a way that can be easily distributed e.g. half our team half their team. Even if they cannot help we can distribute amongst ourselves

### Keeping up with high volume of commits

These suggestions also apply to Twitter, papers, and other social media.

* Prioritize  
  * We cannot look deeply at everything that is sent in the channel, there are certain things that are higher priority than others.  
  * Figure out how to tune your prioritization e.g. what others pay attention to, historically what actually ended up being important, etc.  
* Have a mental model of what should change vs what is proposed  
  * I find it very useful to look at issues and their corresponding PRs and come up with a rough design for how I would approach it. Then look at the PR itself and see how similar/different those approaches are.  
  * This helps to build experience and also to catch cases that the author may not have caught themselves.  
* Context from end customer  
  1. It's a bit of work, but for key threads, it's critical to work with the end user if possible. e.g. if we have a feature for CLU or Nemotron teams, we need to actually talk to them first and iterate with them on the context.  
  2. At some point we will have enough shared context to do the right thing.

# Code context and design decisions

This section provides historical context and design decisions to various code in the Gym repo. It’s meant to help onboarding folks to understand why certain decisions were made and understand the principles that underlie the decision making process. The sections below are ordered semi-chronologically and should be read in order.

## 3 core concepts organization and what is missing

When designing the existing Responses API agents, Responses API models, and resources servers structure, we considered the following key components:

1. Model concept (e.g. calling GPT 4 or Qwen)  
2. Tool implementations  
3. Verification  
4. Systems of models and tool calls  
5. Rollout orchestration

These key components are all those that typically change from user to user, use case to use case. As a result, they belong in semantically separate parts of our system.  
*Key principle: Special cases aren't special enough to break the rules.*  
*Although practicality beats purity.*

How do we organize these key components?

1. We could have 5 separate files or folders in the nemo\_gym/\* folder with each of these components held inside.  
   1. Key context: But there’s a difference in “core infra” in Gym vs what our users would typically change. So we should decouple the core infra in the nemo\_gym folder and put these user-specific components outside.  
      *Key principle: Flat is better than nested.*  
      *Sparse is better than dense.*  
      *Readability counts.*  
2. What about 5 separate top-level folders?  
   1. Key context: But oftentimes tool implementations and verification are coupled together e.g. if the verification checks the state as a result of tool executions.  
   2. Key context: And oftentimes external gyms will couple the rollout orchestration (e.g. including verification) with the system response (e.g. without verification)

So we settled on three core components and three top-level folders: model concept, tool implementation \+ verification, and systems of models and tool calls \+ rollout orchestration.

How do we name these core components?

1. Model concept: Everyone working on LLMs knows roughly what a model is. Defined concretely: when we send context to a “model”, the model will run inference (and nothing else), and return a response in a structured format.  
2. Tool implementation \+ verification: We initially called this “environment” from classical RL, where an “agent interacts with its environment”. However, the word “environment” was very overloaded and we felt that rather than reuse the existing name, we should call it something new in order to clearly differentiate it.  
   1. Even though coining a new term incurs heavy confusion, in hindsight, this was a good decision to call it something different. Nowadays what we refer to as “environment” is not just the tools, it includes things like the harness, etc.  
      *Key principle: In the face of ambiguity, refuse the temptation to guess.*  
   2. We settled on the name “resources server”, where we use the term “resources” from web server development.  
3. Systems of models and tool calls \+ rollout orchestration: the heavily prevailing sentiment at the time was that “agents” were loops/wrappers around model calls that also called tools. So it was natural to follow the general AI community and name this “agent” as well.  
   *Key principle: Close the user loop.*

One of the key components that we did not consider is the “task” component, where multiple tasks are typically held in the form of a dataset. I was so concerned with where the majority of the “code” would live (where datasets are typically stored in different formats like jsonls or HF datasets), that I made this mistake. So we need to extend the core functions above to include a top-level “datasets” folder. Datasets are currently implicitly held in the agent server config.  
	*Key principle: Special cases aren't special enough to break the rules.*  
*Although practicality beats purity.*

My suggestion for folks writing design docs is to have an explicit bullet point list with key context. That way anyone considering the design will have similar information as the writer. Key context can also include e.g. features of existing libraries.

## Servers: separate folders, separate venvs

The Gym effort originally began in Aug 2025 when we were looking to curate RL verifiers for Nemotron post-training. At that time, we knew that the key was to scale up the diversity of the environments we used to train Nemotron models. This means that dozens or hundreds of people may be working on their own Gym environments at one time.

* Key insight: We needed people to be able to work independently of others.  
* Key insight: As the number of environments scales, the higher chance of things like dependency conflicts, etc.

	*Key principle: Special cases aren't special enough to break the rules.*  
*Although practicality beats purity.*

As a result, we decided to put each specific component implementation in separate folders in a fixed flat structure, and for each component to have its own environment.

How do we orchestrate things in a way where each component can talk to another while still having separate dependencies? We don’t need to reinvent the wheel, this is a very common problem in the wild and the solution is to use servers which talk to each other using a fixed format and channel i.e. HTTP and network sockets which are universally supported on machines today.  
*Key principle: The initial stages of design are identical to that of research.*

There are several negative consequences to using a server architecture for each of the components:

1. It’s quite unintuitive for our users at the time (researchers) to learn about these servers, even if the development happens in Python. This is still a problem we have today. Fortunately, a lot of our users use coding agents who do have experience with Python development around servers 🤣  
2. It’s difficult to trace the path of a request across server boundaries.  
3. We now need people to write code that is efficient enough for serving, not just efficient enough for their use case.

But there are several key positive positioning consequences that we felt was worth the negative tradeoffs:

1. Since we jump to this microservice architecture (it’s literally the most generic thing ever), by design we will not have any issues with modelling capacity i.e. anything people can dream of doing must be possible with this server decision.  
   1. This allows us to consume pretty much anything with no major refactoring, and also for us to be consumed in productionized environments.  
2. We avoid any forward compatibility issues by paying the cost of educating folks up front.  
3. Any major scaling or design problem we run into must have precedence, which makes it easier to do research for key insights.  
   1. For example, if each rollout sent to a server must have its own rollout-specific information over HTTP calls, we would simply use sessions. FastAPI and Starlette have built-in support for such functionality.  
   2. There are many such examples: Middleware, BackgroundTasks for dumping model call records, FastAPI num workers for scaling the compute a server uses, Uvicorn socket binding, Uvicorn lifecycle, etc.

   *Key principle: There should be one-- and preferably only one \--obvious way to do it.*

   *Although that way may not be obvious at first unless you're Dutch.*

*Key principle: The initial stages of design are identical to that of research.*

This is a common tradeoff pattern throughout Gym design that Chris Wing and I strongly disagree on: do the generic thing without reinventing the wheel that is more scalable in time even if it means more education is necessary for the user and their initial user experience is worse. With enough engineering bandwidth, you can always bridge the gap on the user experience side, but you cannot sustainably continuously refactor core infra.

When accounting for environment isolation, there are several levels: no isolation (install all dependencies in the same environment), Python env isolation, containerization, etc. Because our researchers and others in the field most often worked at the Python level and did not necessarily have strong backgrounds working with containers, we decided to isolate environments at the Python level and just have separate Python venvs. At the time it was just not commonplace enough for us to containerize servers rather than just separating into venvs. Even now we don’t containerize servers; rather we containerize task instances.

The result of the above is that we have 3 server types for our 3 key components: agent, model, and resources servers.

## Gym’s native data format: OpenAI Responses and other base types

How should we represent these calls between the servers? What kind of information is necessary for each of the servers and for the user’s use cases?

* Key context: At the time we were designing this, we knew we needed explicit support for agentic trajectories i.e. multiple reasoning, tool calls, chats, etc in a single trajectory.  
* Key context: At this time, the model builder community is still using OpenAI Chat Completions or Messages as the standardized format. The agent builder community is using bespoke formats that partially involve messages.  
  * But Chat Completions cannot properly represent agentic trajectories, specifically the agentic return.  
  * Chat Completions also doesn’t contain explicit representation of reasoning, and the community would just insert a random reasoning\_content field onto messages.  
  * See these [Gym docs](https://github.com/NVIDIA-NeMo/Gym/blob/9ac2470031cebec155264ee66f4c00b76839e2ee/fern/versions/v0.4.0/pages/infrastructure/engineering-notes/responses-api-evolution.mdx) for a deeper discussion  
* Key context: OpenAI had released the Responses API in Mar 2025 to facilitate agentic trajectories.  
  *Key principle: The initial stages of design are identical to that of research*

Given these key contexts, we decided to use Responses API for Gym’s native format. In hindsight, this format has held up for quite a long time, and only recently have we needed to start revisiting the schema due to e.g. sub agents and agent swarm.

One negative consequence is that we now needed to silently convert between Responses, Gym’s native format, and Chat Completions, the format accepted by vLLM and other inference engines. Luckily, Frankie Siino and I had built that exact proxy back at our old company, with the exception that our conversion was between Chat Completions and our formerly bespoke format. This converter, implemented in the Responses API model vllm\_model, has lasted mostly unchanged for a while and has graduated to core Gym infra\!  
*Key principle: In the face of ambiguity, refuse the temptation to guess.*

One positive consequence: given we keep to OpenAI format, we naturally get to upgrade and benefit to whatever OpenAI schema will evolve to be and support. For example, the next format we may upgrade to is OpenAI Agents format which includes Responses but provides additional information on top of it. This makes the transition easier.

Why reuse rather than invent? Everyone building models or agents knows what Chat Completions format is, and Responses is a slight modification on top of that while retaining the majority of the flavor. So we don’t need to re-teach anybody, just let them know it’s a newer upgraded format. We also got very lucky that OpenAI had been doing exactly what the community had wanted to do i.e. they were leading. Understanding why OpenAI designed these schemas the way they did was key to the design process. One day if we lead and have a good read on where we are headed, we will invent.

The Responses and Chat Completions types are copied explicitly in the Gym core infra so:

1. It’s explicit to people contributing to Gym what format is supported and expected so debugging is easier.  
2. It’s easier to reference because the types originally are heavily nested within files and namespaces inside the OpenAI Python SDK generated by Stainless.  
3. Stainless republishes the PyPi package on any update, so the Python SDK would change versions every couple of days, which was very annoying. Copying the types also isolates us to this sort of churn.  
4. Copying the types makes type changes and updates explicit rather than implicit so we can fully understand the design and need.  
5. The Pydantic models are used for type checking and schema validation on FastAPI routes by FastAPI.  
6. They can easily be used for downstream use cases.

For the remaining key Gym formats e.g. BaseRunRequest, BaseVerifyRequest, and BaseVerifyResponse, really is not much required for the requests/responses besides the responses create params, the response, and the reward.

## Modeling exercises to regularize our design

We can use common user use cases to regularize our design.  
*Key principle: Close the user loop.*

At the time we designed the core of Gym, we considered things like:

1. External Gyms that have their own rollout collection logic and/or couple the harness logic with the tasks, tools, etc  
   1. ⇒ Responses API agent has two functions /run and /responses. The right integration level for external gyms is via /run  
2. Parallel reasoning e.g. Grok heavy where a single agent call can call the model multiple times for additional test time compute scaling to answer a single query  
   1. Nowadays we have new terms for this like subagents and agent swarm  
   2. ⇒ Implement in the /responses of the agent server and call the /responses of the model server for the unit level model call  
3. An external Gym or harness has it’s own tools  
   1. ⇒ Agent server doesn’t need to call the resources server if it provides its own tools e.g. Claude Code local tools  
4. An external benchmark has additional metrics to report and aggregate and doesn’t rely on a resources server  
   1. ⇒ Overridable /aggregate\_metrics on the agent server. By default simple\_agent /aggregate\_metrics will call the /aggregate\_metrics of the config’d resources server  
5. We want to integrate with MCP  
   1. ⇒ There isn’t anything else beyond initializing a session via /seed\_session and calling the tool implementations on the resources server

Example of more recent modeling questions (after the core of Gym was designed) includes:

1. Self evolving agents 2 levels of design  
   1. ⇒ For agents that only change their harness after a response to the query, /run orchestrates the change, /responses still just runs the agent assuming a fixed harness  
   2. ⇒ For agents that change their harness during the query, /run calls /responses, /responses updates the harness on the fly

As the world evolves, we need to evolve with it.

* One key signal is when people start forking the original repository and modifying the core infra. We still need to do our due diligence and see if indeed their use case is so out of distribution for our support (i.e. we need to try modeling it ourselves), but it’s a salient sign to consider.

	*Key principle: Synthesize user feedback into proper solutions.*  
*Key principle: Close the user loop.*

* One example of evolving with the world is Gym’s native trajectory format. There are key needs from e.g. CLU side to track things like time taken, cost, usage, etc that are not well supported by OpenAI Responses alone. So we need to consider upgrading Gym’s format to support the world of needs like what CLU needs. However, there is also buzz about subagents and agent swarm etc that we have less confidence is going to become a key use case. As the world evolves, we will work with others and continuously update the importance of these subagents.

## Connection to RL

A key requirement for Gym is to easily integrate and connect with RL libraries like NeMo RL. I spent quite a lot of time working with Terry Kong working on the expected contract with RL, and on solving the re-tokenization problem for multi-step multi-turn rollouts, which was one of the most fun experiences I’ve had.

* Key context: Our environment developers are domain experts in their respective domains e.g. safety, legal, etc and not experts in RL. They know how to run RL but that’s typically the limit/stretch of their background.  
  * So, one key constraint is that we need to enable our environment developers to create environments without them having to touch token IDs

*Key principle: Close the user loop.*

The way we solved this was to silently propagate token IDs on requests/responses to the agent and model servers. The token IDs are additionally sent to the vLLM endpoint managed by NeMo RL so that we can perform fixes to guarantee on-policy training. Additional details can be found in this [doc](https://github.com/NVIDIA-NeMo/Gym/blob/9ac2470031cebec155264ee66f4c00b76839e2ee/fern/versions/v0.4.0/pages/contribute/rl-framework-integration/openai-compatible-http-server-on-policy-correction.mdx).

However, while this approach works seamlessly for Gym-native servers, it caused quite a few issues for black box harnesses like OpenHands, where the environment developer would need to modify the black box harness to properly support the token IDs for training. This is where approaches like Polar and SwitchYard come into play.

* Polar is a research paper from Yi Dong and Binfeng Xu. They are interested in systems and data research. They will do research in good taste and help us solve problems we will run into, like in this agent harness integration problem. I think of them as helping us in the 3-6 month horizon, and our other users like Nemotron will help us in the 1-3 month horizon.  
* It’s also important to note, because Yi, Binfeng, and other folks do systems research, it’s actually quite important that they do NOT use Gym because it would otherwise restrict their system design space.  
* Another example is Megatron RL and NeMo RL, where Megatron RL is not tied to the same production requirements as NeMo RL and is easier to use to conduct research.

Another requirement for enabling easy integration with RL frameworks is to not clash on key dependencies e.g. OpenAI version. As a result, the Gym pyproject.toml uses unfrozen versions (except \>= for security reasons) so that downstream RL libraries with similar dependencies don’t run into issues consuming Gym. And Gym can still have frozen dependencies in isolation using the uv.lock file.

## Gym scaling studies

At the time we were designing Gym core:

* We were running GRPO RL training around 64 prompts per step x 16 rollouts per prompt \= 1024 total concurrency.  
* I knew that this batch size was too small, up to an order of magnitude.  
* I additionally knew that other labs were able to go 8, 16, etc steps off-policy.  
* So the total rough concurrency to test and certify Gym at would be around roughly 1k \* 8 \* 8 \= 65k concurrent requests.  
  *Key principle: Close the user loop.*

While using AsyncOpenAI client, the maximum concurrency I was only able to achieve was around 128-256 concurrent requests.

* Key insight: Today’s CPUs could more than handle this concurrency at even 1GHz. One CPU should be able to comfortably handle 10k-100k concurrent requests; this is the speed of light (SOL).  
* Additionally, other companies in industry like Google run against significantly higher concurrency than 256 requests, likely on the order of millions to 10s of millions. They must have a compute efficient way of handling all of their web traffic against a certain latency SLA.  
  *Key principle: The initial stages of design are identical to that of research.*

After drilling down, it turns out that the AsyncOpenAI client used httpx as its async HTTP backend, and that httpx had a very inefficient O(n\*\*2) where n is the number of requests algorithm for connection pooling. Connection pooling is a critical feature of the HTTP backend since for Gym we typically have significantly less servers than we do requests. After swapping to aiohttp HTTP backend with better connection pooling algorithm, the issue was resolved and we could comfortably run at 65k concurrent requests. See this [doc](https://github.com/NVIDIA-NeMo/Gym/blob/9ac2470031cebec155264ee66f4c00b76839e2ee/fern/versions/v0.4.0/pages/infrastructure/engineering-notes/aiohttp-vs-httpx.mdx) for additional details.

Gym’s scaling with the aiohttp backend was tested with 65k concurrent requests during RL training. The baselining and testing W\&B report can be found [here](https://wandb.ai/nvidia/bxyu-nemo-gym-rl-integration-20250926/reports/NeMo-Gym-Baselining--VmlldzoxNDU1MDU5MQ). At the experimentation config, 65k concurrent requests finished in around 30 mins. After using 16 FastAPI workers for the model server, this time dropped to around 20 mins. Likely the token ID serialization/deserialization is a significant portion of the time spent with FastAPI num workers \== 1\.

Key context: our environment developers don’t have the background to properly use this HTTP backends.

* As a result, we wrapped all of these functionalities within a single function `request`.  
  *Key principle: Flat is better than nested.*  
  *Sparse is better than dense.*

*Readability counts.*

* A positive consequence of this design is that now if we want to upgrade Gym’s networking protocol e.g. to use GRPC, a novel data store, or RDMA zero copy, we can simply override this request function as appropriate and parameterize it in a config.

Another example of this principle to do research and have a rough estimate of SOL is recently during NeMo RL training, where training was very slow.

* Key context: Our vLLM engine would run around 40 effective tok/s/request.  
* Key context: Our maximum seq len for RL was 65k tokens.  
* Key context: Our rollout step was taking 60mins.  
* Given these two parameters, a single training step should take around 65k / 40 tok/s/request \~ 25-30 mins, significantly shorter than our back of napkin SOL, which indicates a severe bug.

After running the baseline training run, I hacked the code to query rollouts against an externally spun up vLLM server. To my shock, it took more than 17 minutes for the first rollouts to even reach the vLLM server. After digging around, I discovered that the NeMo RL async RL flow was using threads for parallelism, and the thread count for a single process could reach 512 or 1024 which would significantly slow down querying given the Python GIL. After fixing the issue, the step time dropped to around 30 mins, a little higher than SOL but much better than the 60mins we were previously experiencing. See this [MR](https://gitlab-master.nvidia.com/terryk/nemo-rl-internal/-/merge_requests/292) for more details.

* We don’t need fancy observability tools to make the key progress on performance or design.  
  *Key principle: If the implementation is hard to explain, it's a bad idea.*  
  *If the implementation is easy to explain, it may be a good idea.*

## Config system

We needed a high-capacity static and runtime configuration system in order to support all of the config needs for our servers.

* Key context: Most researchers are familiar with OmegaConf and Hydra syntax for CLI config. In fact we have Olivier Delalleau here at NV who made them\!  
* Key context: We need to be able to configure and reference servers by server instance name.

As a result, we decided to go with a recursive structure where the top level is the server instance name, the second level is the server type i.e. agent, model, resources, and the third level is identically the config that is used to spinup the server instance. We can override certain properties at runtime via things like `++my_agent.responses_api_agents.my_parameter=2`. Similar to many things above, this design is quite unintuitive at first and we need to bridge the user experience gap still. 

At the time we designed this, I thought one key requirement was that we need to be able to compose recursive levels of configs (through config\_paths), but I don’t think that’s a good experience. Likely if there is 2 levels that is more than enough e.g. one benchmark config and one config containing a list of benchmarks or something. But in hindsight, it makes more sense to restrict how nested configs can get. Happy to consider proposals on how to structure Gym configs with equal or higher capacity. 👀

For the Gym global config:

* Key context: Environment variables are incredibly difficult to track, easily get lost, are hard to discover, and are tricky to override correctly.  
  * ⇒ No environment variables. All configuration is found in the global config.  
    *Key principle: Flat is better than nested.*  
    *Sparse is better than dense.*  
    *Readability counts.*  
* Key context: Similar pain point as environment variables, it’s so hard to track all the changes to a config across servers if the config is distributed.  
  * ⇒ Global config is static after a single resolution  
    *Key principle: Beautiful is better than ugly.*

  *Explicit is better than implicit.*

  * Another example of this same principle: prompt materialization using the chat template should be materialized ahead of time so trainers can inspect it.  
* Key context: Piping configs through everywhere is annoying and results in a lot of dead code.  
  * ⇒ The global config is available anywhere in Gym via get\_global\_config\_dict.  
    *Key principle: There should be one-- and preferably only one \--obvious way to do it.*

  *Although that way may not be obvious at first unless you're Dutch.*

  * Other examples of this: Centralizing everything as much as possible: Gym Master doc, one channel, all environments in the same repo  
  * Top level results, data, scripts folders \- have an obvious place for things to go which will help centralize 90% of things

# Technical topics

These sections are not meant to dive in detail about each topic, rather they are high level surveys of relevant items and short explanations of what each item is. These surveys can then be used to do further research.

## The world of model training: SFT, RL, research, and what this means for Gym

There are several axes for research in the world of model training:

1. Data: Curating training data on a particular task or domain. Requires a deep expertise in that task or domain.  
   1. e.g. agentic coding data, chemistry knowledge data, conversational data, etc  
2. Input data types: What information and learning signals are provided to train the model  
   1. Pretraining: self-supervised, inputs are sequences of tokens  
   2. SFT: supervised, inputs are sequences of tokens and masks that mark tokens trainable or not  
   3. Policy gradient (PG) RL: supervised, inputs are sequences of tokens and a reward signal  
   4. Direct preference optimization (DPO) RL: supervised, inputs are pairs of sequences of tokens and a preference of which one is better.  
   5. On-policy distillation (OPD): supervised, inputs are sequences of tokens and corresponding log-probabilities from a teacher model.  
3. RL algorithms: how input data is turned into optimization signal to train the model  
   1. Within the policy gradient algorithm family:  
      1. REINFORCE: use a model’s own probability distribution to estimate and encourage high reward actions  
      2. Trust Region Policy Optimization (TRPO): bound the weight update within some KL term  
      3. Proximal Policy Optimization (PPO): clip out-of-distribution advantages to implicitly bound the weight update  
      4. Group Relative Policy Optimization (GRPO): rollout a prompt multiple times (a group) and baseline the rewards  
4. Optimization: how optimization signal is turned into weight updates for the model e.g. AdamW, Muon, etc  
5. Systems: how to organize when each part of the training loop runs, on what compute, and how data flows between them  
   1. e.g. async RL, pipelining, kernel fusion, etc

SFT and RL are two distinct tools in our model training toolboxes.

* SFT causes the model to memorize its training distribution, so it is very good for tasks with narrow data distributions e.g. the model is one component in a larger and well-architected system.  
* RL updates are much smaller (literally less weight change), and it is very good for tasks with larger data distributions e.g. the model is exposed to the user, who may say anything they want to the model, or may have a variety of tasks for the model.  
* Typically we say that SFT hurts generalization and RL doesn’t hurt generalization.  
* When people train models, the data is developed and built incrementally. With SFT, this causes problems because every change or update to the data distribution may cause unintended regressions. As a result, it’s more difficult to build a general model using SFT.

When researchers train models, they typically look at summary metrics like reward over steps, loss over steps, reward by task, entropy over steps, etc. If there is something unusual, researchers will look at the underlying data. For SFT, this is the input SFT data. For RL, this is the rollouts produced at every step.

In the world today, all enterprises are interested in applying AI to their use cases in some way. The most important part of that is data i.e. evals to measure performance and subsequent training data if performance measured by evals is insufficient. This data encodes their product and business value. So majority of enterprises looking at NeMo (with the exception of enterprises who have business hosting training services), will look first at NeMo’s data libraries as entrypoint i.e. Gym. 

The relationship between Gym and RL is that RL uses Gym as a rollout tool. RL pipes a bunch of Gym prompts to Gym during rollout collection, Gym rolls out, and returns data (e.g. sequences of token IDs and rewards) to train on.

## Concurrent vs Parallel: all about “frame of reference”

* Majority (\>= 90%) of things in Gym should be concurrent i.e. asynchronous (async) in Python. Async programs will always use a single Python thread (mapped to a single Python process, mapped to a single virtual core juggled by the OS).  
* We can get away with light programs mixed into async calls since today’s processes are quite beefy on their own (1GHz without overclocking)  
* Since we need to run at a very high scale which may exceed the resources on a single machine, we need to distribute the programs over multiple machines, which is done in Gym by Ray. Ray is a distributed computing library.  
  * There are multiple alternatives to Ray e.g. multi processing \+ MPI (in the good old days) but none have as good dedicated support/development, use Python, or have as advanced features as Ray.  
* A typical pattern is: async await model response, ray.remote an expensive tool call, etc

![][image1]

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATcAAAG0CAYAAABXBmBEAAAQAElEQVR4AeydBYBVxRfGv7tL59LdEtItINIKCkgoCKLSioIi1l/EBEVU7G4sDGxFUZBWpKRFQBSQ7u7439/AWxfcVXb3bby3Z2FuTJyZ+ebON+fMzH034oT9GQKGgCEQhghEyP7+EwG/3RVw/xn5XyIEZATOsUX9t7DY4p+tH3LPNq7Fix0BwzB2XFKrr5Hbf7TMoUOHNG7cOD355JPOPfXUU1qxYsV/pPpn8O7du/XCCy9o5syZ+u6777R48WJHmGfGfO+99zRjxowzvRN9T35//vlnouXEFPD000+7OmzcuFF//fVXzKAUvV62bJlmzZoV9DK8+OKLQZdpApMOASO3/8D24MGDgnC+//575ciRQ6NGjdL111+vY8eO6bffftOnn34a3bG/+eYbR1oQGGLnzp2rzz77zMXdvn277r77bo0fP17vv/++Izk0gT/++EPvvPOOli5dShJHoJCpu4njsGPHDpfn8ePHtXLlSkcwe/fu1bZt23TgwAFHjrt27TotNZ2d8k6ZMsWVMRC4fPlyR7akX79+vSAqwtatW+fkcU15SMd1wBHvlltu0bx587R69WpNmDBB3377rfbs2eOiUA7SIN95xDhs2LBBX331lcgv4M09eHH/+++/u3rghxziBeSsXbvW1Zf8du7c6a4py5EjR9z1L7/8IvJ94403BObI+/rrr7VkyRIuT3PgRx7z5893/pAi7U18sMSTNpo9e7b27dune++9Fy/n1qxZI9qBm0B7b926NbpOP/zwgygr4eZSBgEjt7PEvWrVqurTp4/y5MmjiRMnatOmTRo4cKAgtCuvvNKR080336zLL79cjPAQ1qOPPqovvvhCDRs2jDUXNMCrrrpKECfpIJFYI57hCQl89NFHmjRpknr27KmjR4/q9ddfd52NvPfv36/bb789mmgCydE+M2fOrAceeEB0Tkjgyy+/VK5cuXTnnXcqZ86cuu6661z0zz//3JFkt27dFBUVJchv8ODBLowDfpyLFy8uNEKIIX369Orfv78jmR49eoh75NPRiYsj7n333afChQvrkUcecWnr1aunKlWqaOHCha4eL730knr16qXq1aurZcuWoiyQEPVFPrKj/DI98cQTjkACRAdZMYBQx9y5cytbtmzq3Lmzkw1BPfTQQxQh2l1wwQUuDE15lD9ooZVT/8qVK7t6QGjPPvusNm/e7Aam6IT+xdSpUwUJ+5euDTiDKTj873//c5gy8FEXwswlPwJGbmeJOQ8+nQVCgLAKFSokzDLP8/Trr7+6zo+2U6dOHfFAd+nSRX379pXneaJjxZZNs2bNXAepWbOmSpQooS1btvwj2s8//yxIEpKg8xKBM4T29ttvO40E7YI8KQcaR5MmTUR5hw0bRvRoBzHUrl1bjRo1cloWpHvTTTcJLQ9tJVOmTEJDQgZaasmSJZUlSxZRp3PPPddpUwFhxOUaYoTgmjdvLuqDJoc/ZYG0qlWrpoiICKFZ4Q/xonFRZ0g2Y8aMIh55QXjEY+CASIsUKeK0L3DErEcTg1CoK+krVKjgtF7KjyaNfNogXbp0rtzTpk1TpUqVHLaUgzIRJ+AYVCD0RYsWiXRogAwKxYoVE8THYMO0RKtWrfTwww8HkrnzhRde6DTgkSNHCi3xlVdecRosZe/QoYMg5p7+wPPmm2+6+HZIfgSM3M4S85t9rQztBVJp27atMzfRti655BI1aNAgWgrkgcYCIb366qvCdOM+OkKMC0gJcoCs6HwVK1aMEXryEnLJly+fM4lP+kjkUbp0aWc23nPPPZozZ47rTMhB+4H00ORq1KgRSOLOGTJkcEQDoWB+vfXWW07rgFijoqJcnOHDhzvtDRIpX768IBXioR2dd955Ls6Zh8jISEEokFggDMIhHXN95Ot5ngsiLsTpeZ4gDjQdzzsZRnocESkjZ+7PxA/cAo58Dx8+LOqOCSsSnXLcY3JCMJjl7du3PxUiQbLUGy28fv360f6BfJELYdLegbyiI/kXBQoUcBrlkCFDBNFCxmiYkNsHH3zgCG/MmDEOXz+6/U8BBIzczgJ0OpjnneyAgeiM9Jg/jPaYI/gH4tFx6NxFixZ1c1F0Duai6Nie5zltzvM8p+FhPqGtoN0RJyADeTjMYTQAtDHC8CMN+UJymG/MAWJyofngh+kMedEBiY/zvJP5Bq4hFjo/HZPyU2bC0HQgAjo+pEIdyQ+CQqsjTsARB1PR8/6WHSgj5SUdWhrEA1mQDnlofWiilLlMmTLCzEYbhpghc2R4nkd0R8ZceJ7ncOMaMxfiAAMGGsrPfN/kyZNd/Lx58zpNmgEDTCgHpEU80uOY4yRt1qxZxRwgeEBkhOE8z3OkRXkhK+ZKKRdhAUf7Un7uGYDOOecctWnTRlyj5YM/Zjjh5pIfgYjkzzK0cqRTtGvXTphdMUt+9dVXC3MFkwztiU7EvFXdunWVPXt2XXbZZU7bwvRjdIccbrvtNmfuIA+zhc5FGBoh5lDjxo3dvB7nmHnFdk36jh07ujzQINHkyJtyQhZ0PAgmkJb4gY6IRte0aVNnRgYmxfv16+fIg475+OOPu/KTdsSIEU4zxFRFC8Uv4JjzYqIe87Gkb8Liz5wVZ+bTIGzIGQLFD4fJ16NHD7eaCTFzj1lHXPKmLuADIXmep2uvvZZkAhPMUG7AHKKtVauWMJcvvfRSN/eGP/HRxAhjsLj11lvdtADzZ1yTHkd4uXLlnFlPGcEOczKQL2WGrM4//3xnbjINETM9MhhUWAGHuJ955hlRLzDGPGc+FTMYHIhrLvkRMHL7D8zRMiCqiy666LSYUVFRYk6rdevWbhGBDg5R1fMnx4mICcfEOfNVkB8mHuRHJ6UT0bk8z3Mj/YMPPugmzj3PcyYhnQMZ/+aYE6JTEgf5nHGQKXNZXbt2dVoMfjg6a9myZbl0Zi3lghjIu0WLFs58RjPBTO7UqZNbXCBywYIFRRw6NqSNX8C1b9/eLapQ95KnyO2GG25wJAkZkA7s0I4CacgD7ZIwCNfzPEEi3F9zzTUCb0gb7cvzPCGPtJBxwGxHI2Plsok/txgIA2vwgHDQmqgD8SF9ZDPfSNyYDlOSejFIoXFBtmi9gTISF5xoV84sFOAXcCw8UAbi83xA1IRBrrQJAxb34elSf62M3FJ/G1kJYyCA+Rrj1i4NgTgRMHKLExoLSI0IoOWlxnJZmVIfAkZuCWgTVgBZBIhtkyYrbMxPsYIXUzQbaJkDYjUtpn9s18iPzT+mH3uvmKzHkV/MMLs2BAwBKUzILXmakm0RkBbzahAVG3jJmZU2JrhZFcSfNxBiEh/719ib9eOPP7oNvoSxUkna2BxzNgF/5DHpj+yAH+fXXntNY8eOde7jjz92O+MpH2E4rtkXxnVsjq0eMf25Z1WXuvDGAdeBcFYTA9eBM/G5Jj6rkDHj448MiJ4yxKwrODEwECemY3UXOTH9zrymHMSL6c9iDGWI6cc9eVImyhEIozyscoNNwI94Z/PqGIMJaVgFjxkfmbwlQhiOuvHWCc8J9+ZSDgEjt7PEng2hH374oSAoHmi2dTD5TOdhCwKExSQ3YWhnaFRsV2BFEU2MSXeyIj2729mHRkenc06ZMoUg8dYBHYVOSQdhuwKvfvF6DzvlkU1Etm1AeGyFoLOzAXfBggUaPXq02xSMHLZLsKGW/EkTcKzqkT/1effdd0U6VkTJhxXF5557zr1t8cknnwj5bFSmzMx1EYeyDB061L2SRtnxo36UASJj8/D06dPda2msJLIRllfQIOm77rrLbZaFlFetWhUokluNZEBgMy3xKRP7z4iAVoof++zYdsJ7uezjo2z333+/yDdAVgwALCzwNgPpwZ99dLy1QN1Iz+ouq7O8KkVdqCcrtWzohRRpS/LllS/am/xYkOAtBjDgrQPai3hgzJYWiB7cKBN5sP3DVklBMWWdkdtZ4A/ZQGLseWJVkNUxOiuaG8v9dJBSpUqJbQOe57nd8az60YlZYWRVDc2NrNgywkonWw/YeU+no5MRRkel03FNXsjmzKtJbIgN7MNi6wHyWYXkmhVOVl+5pjOyTw3iZc8aRIe8gKNjs5LJ6h9ESh5sU2GFktfLWOXF8Y4mnR5zmnu2xEBSECb5sArKPjhWPFklZCMx2g2kTR2pM4RBPuxBQ+tilz8rmKwcs5E3UCZe8UIO+UCkkD6bicGd19g4Q1LUhxVeVi3RhiFoVk55ywBZxIPgyYOyQ7bgzEADKdEeaGqsKIMr219IzyZsZFEH3ghBFgMUJMlAgFzwZSsP8nBgzitbtC/lhtDAh3zYTsKzgBxzKYeAkdtZYA+R0aHpNJCY53nRqdjaASnQcQcMGOC2X/DAQz5EYk8Z+7e4xpEeMqCDQEL4xXQQhud5ovPR2XCYnbzug7ZIXMiIcPKhXJjJ+fPnd+9rYjJBRGgWaB5sOyFNTEcZ2OLBniwIk20iECidk45Px0U+mhRbKdgzB6lLcmKID3mhzfDmBiQJiQU0S+SjqSKD7SeYaJhrEACaY+/evRUgEQT+9NNPAie2f1BHz/Pcq16QCpoh/gwuaEoQJdtcSEedITvw4B7HJmDaibJAcAwKkDnlp30gc/bCQcRocdQbLEgbGFi4junYYgIGYAvBUifSoTGixUFyEDoYsBUFQg5sYYkpx66TFwEjt7PAGy0DkwNtBqKLmYRXrDDL2PjKxl7mjTzPi36XMmZcriECHOYLZiyaBHKZC0LDIA7ECMmx/4xOw/4rNAg6LOE4z/Pc60v4QQj44djjhZYEGZIOTQb/mI46YEajyZCP550kazbgkg+dFq0QbQptknvKGVMG1126dHFzfuzEpz6YhfjH5kiPycpeP0iG16IC8SA2ygx5oHFCRJSNvWlot2zOhYAYEKgT2mcgbVxnCI+X7okPoWFyPvDAAyJv9rZh9oMVWGAGQ+iQIkRLfSG+M2UH4kO4mKG00xVXXKHu3bs7c5s3LNDmyQcs0TbPlGH3yYdARPJlFdo58esSaDK8S4rJgXbEtgQ6C0TBRlDmyBjRcWgZhNMhqDnaDht/IQ02eDKHhpmDpgEpYGrRIQmn8/DKFTvyMa2QDXkSjiwcspmnonNCLvghHw0D0oRISMerQ4TFdOzoZ76KeGhFkDfhaFXMv1FHTD3OaGZsVGbDMnEgGYiAa0iDPJjbIl9MRQiRMOrFGwBcc4a00JaIDwlAMITh0E4hCTbxUh42+VIX8EbLon5oiryvS3oGgZjykYHzPE+YmVwzz8agQXxw5M0NzF/umWtE4wuUh828xEEjg1ipLwMQ9xArZiYyIWDSoxVDnLQTRAaeaHeQHNo0cTBzMb9JZy5lEDByO0vc0aCYXOehZV4LU5NOgdYESTBXhBnoeZ771Q3MEjoYnYYsIADMR+be0KaYm0FrwrRiXowOh/lJh2C3O36Ydo899phbxGBeyPNOaljIYwc+7zui3bRv3x4v9wJ/jx49RAelLJSJpql5IQAAEABJREFUTuwCYxzQsnjJmzC0QzSnQDCaBwsCmI74ERfSwfxu0qSJyIs5JsLo9OTBosWgQYPc61yYZJ7nuTIwEU88iBFTlXoTHwJlcCAM53me0BjJK2By4k85OOPAhMl70nOPSQ2xcB1wzIWy2MC953kiH+IzmHie594C4R7TlvbEpOeeOkPkpIPgaWMWJnBoYMyREkZ7EZ+VatqJ9LQr8Xv06CGeBQY74tC+pEmos3SJR8DILfEYhpQENERI4GwLDdkwZwaR0dHPNp3FMwRSGgEjt5RugWTOH7KKD7mx5w5thPlENJdkLq5lZwgkGAEjtwRDZwkNAUMgNSNwVuSWmitgZTMEDAFDIDYEjNxiQ8X8DAFDIOQRMHIL+Sa0ChgChkBsCBi5xYZKSvlZvoaAIRA0BEKe3NifxM51c3VlGKRNDPg8JBujg8YKYSIo5MmNXfFsADU31W2ENRzSHg58P5dfaAkTTgpaNUKe3DzPc7+7z3t+5jIZFpnOBoPwimP7D2Pnw5Ant9irZb6GgCGQ1hEwckvrT4DV3xAIUwSM3MK0Ya1ahkAqQCBFi2DklqLwW+aGgCGQVAgYuSUVsmEql98y48c5A9VjdZYfmQzc29kQSC0IGLmllpYIkXJAZjF/pZbfMuNXhNmKwLcPuA6RqlgxwxyBtERuYd6UKVc9fsIbkuOnt1988UXxcZWUK43lbAicRMDI7SQOdkwgAp7niQ+5oLXxMRl+2Zcft0ygOEtmCAQNASO3oEGZNgXxXVG+kcBrcPxcOd+OQItLm2hYrVMTAkZuqak1QqAsfMCFb0jwcRXm1/j4MR+J5rsBfLsBkuPDLiFQFStimCNg5BbmDRzs6vHhm3bt2rmPwTz88MOaN2+e+BIXjhe4+bDN8OHDg52tyTME4o2AkVu8IbMEkBvbQVhACKDRsGFDYY4++eST8ry/v9IVCLezIZDcCBi5JTfilp8hECwETM6/ImDk9q/wWKAhYAiEKgJGbqHaclZuQ8AQ+FcEjNz+FR4LNAQMgVBFIHjkFqoIWLkNAUMgLBEIW3I7cfyoDm1fpP0bJpsLAgYHt8yKdwc4dnCLYR8E7HmGD2yeoWMHt8a7DdJygvAlt6N7tXv5KB1Y+Ym5IGCw6acB8e4nBzb9qO1z7jP8g4D//pUf68DmmfFug7ScIHzJ7cQJpcuYV3nK9AgzlzL1OXZkT7z7yYnjR5QpRwXDPwjPYM4il+jEiaPxboO0nCBsyS0tN6rV3RAwBCQjN3sKDAFDICwRMHILy2a1SgUBARMR4ggYuYV4A1rxDQFDIHYEjNxix8V8DQFDIMQRMHIL8Qa04hsCoY5AUpXfyC2pkDW5hoAhkKIIGLmlKPyWuSFgCCQVAkZuSYWsyTUEDIEURcDI7Qz47dYQMATCAwEjt/BoR6uFIWAInIGAkdsZgNitIWAIhAcCRm7h0Y6hVwsrsSGQxAgYuSUxwCbeEDAEUgYBI7eUwd1yNQQMgSRGwMgtgQDv2btPb435WhN/nK0xX03Qy+98qqNHjyVQWsKTTf35Fx0/fiLhAkIs5aKlv+ujL8c73L/4boreHjNW6zZuDmotTpw4oXmLl+nPNevjJfeP1eu0+LeV8UqT9JHTbg5Gbgls+207dumltz5RhOfJ8zw9+sLbOnzkiA4eOqzNW7frt99X+aRzXNNnznd+gWxWrl6rmfMW68DBQ86L83y/Ix06fNjdcxg36SetXruRS+fmL1mmDZv++RPTb374pfoPfkTHjiU/qbqCpcABMv/WxyeA+9cTpmn+kuWuJLTJ1J/nuesjR476uBx31xxoF84Bt37jFn03eUbgVhDanAW/aufuPX67ndC3E3/SvEW/ufBVf63X+Kkz3TXxjh07Ltpx6/ad0X604Q2DR+j7qT87PzukPAJGbologzy5cqpJg9q6vE1z5cmVw0m6tPsgXXfHcC3wO9yTr7yndOki9b8Hn9VUX8P6cfYCvfXR11q7frOGPvGqjhw9qitvGKIdu/bo0eff0ez5S9T7lqEqU6Kops2ap1ff+0zvfzZOy35f7bQVNBWXyalDg9rVfPnpdML/d8orTZxKFSvscL/0okaqUKakDh064mvP4wXRRUZG6MGnX9echUsd0Rz0B5FPv5mk8VP+Jp1nXv/Ax3e+Spcoop6DHtC+/Qf03Jsf+RrgFg0e/py2bN+prdt3aM++/Xr9/S/0+bgpypUzu5p16qftO3fr4Wff1DOvfeCuAdzzPBUrUlB1qlfU4cNH8DKXChCISAVlCNkifOd3mKgKTYS7smMrZcyQwWltbz8zVH+t36TcUTlVt0YlDR98g6656T4tXbFKdatX0qUtG6nzpRfqyZdHq1fXdrqgXg3RKZf/scZpIes3bVHnti109eWttXrdRqdN9OnWXhc3a3AaVuXLlFDO7Fl9P893aec/5ALmuHU+VvVrV/ExbaIu7Voqf97cOnDgkOpUq+gPDN9pra+hdR94n1o2rR8N0LXdOqjDxU1UokghLfz1d6fBHThwUK2bn6+R996sY/6gUzB/Hh/bbPrD17SL+8RVs0oF1atZRVNm/OKIrn/PzjqnZNFomXn8ga5c6RLR93aR8ghEJG8Rwiu3lo3raedvk527uc+VjqAiIiKUPVsWZ6py7XmeIz20NEyeLJkzKX26dCpSMJ8fR5r04xw9+/qH/nzdUaGFfPf+c1qy7E9VuOByDbrvcd3Uu4sK5s+rRh36auA9I8MLwATWZvCNPRXAvUiBfJoxZ5G69R+ifv8b7pPPXJUqXtjXaCN98/K4duzcpZw5silD+vTRufW6dZhuHPKYMG+zZMnoa9DHdOz4cdFezF/mzJFdnt+OnueppK8l5s+by4Ux7cBca66cOVz7ET9aqF2kOgQiUl2JwqRAdXwNDXPzy++n6v3Px+m2flerfq0qGjdphr6d+KPufexlNW9YV/sOHFD5c0q4zrNrz15HYMUK59ewO/opXWSkPvt2sjZs3urfX6+1G4I7cR4mUPvzZcf9gcJTJ1/bhcRm/rJYv6/6S2hX9498RV+++fhpVWWAqee3BWe0bV+AMvuDzidjJ2rYU69p4dLlypsryuHO/Nocfy7umx9+1E/+tELLJvVOk2U3qRcBI7cEtk1OXxu4zJ9rOzN5985tnFcj39QsUbSgfp67SH/4q26Drr1SmJEVypbUtJnzdc+gPqpZtYLO9+fNpvqmTu1q56pZwzrq2r6lfpqzUKvXbnBxSvtayDqf1Jiz+/T1x5zsmIeuHVopMiLtNCPm4fl1qkVD0PC86jqnVDE9evdNAkcm+S9v00Jr/AWZejUr+1rZUR/nc6Pjc9HzirZikWDOgqUa1PdKvFSzcnmf1Fa4+U7mMlv6WnmUP892RbuLlCljRjdn+spjdytrliyqWK6U075dwhiHSuVLO9M1hpddpiACaadXBBnkXL5pQic5U+zAPl2jvTpc3FQP3zVA993S1/nlzR2lXl0u1fDB/Z1Zg+c1nVprxJAb1arpyfm0Nhde4NLcdVMvN39Uv3ZVp7URB3OWNDHddVd3FPN1Mf0khe0teDS/oG50/S7ySahaxXK+KVrE4XjLdd2EdlX+nJJu0aZ/j07RcQMXkOMDt12nwTf2UOsWDQWBNapX0+EMnsQr7E8bdPGJjYWEftdc5mRXrlDGTTlU94kwQ4a/zVzi4yDeJg1qcWkuFSAQkQrKYEUwBIKOQB5/gv9KX6sNDBpBz8AEpnoEjNxSfRNZAROCQKaMGVS2dHFl9M8JSW9pQh8BI7fQb0OrQQoiYFmnXgSM3FJv21jJDAFDIBEIGLklAjxLaggYAqkXASO31Ns2VjJDwBAIIJCAs5FbAkCzJIaAIZD6ETByS/1tZCU0BAyBBCBg5JYA0CyJIWAIpH4EjNwS0kaWxhAwBFI9AkZuqb6JrICGgCGQEASM3BKCmqUxBAyBVI+AkVuqb6K0XECruyGQcASM3BKOnaU0BAyBVIyAkVsqbhwrmiFgCCQcgTAntxM6cfywuSBgkNBH7MSJY4Z/EPA/cfxIQpvgbNKFZZywJTcvIr0iMuXR3l2LzAUBgyyFmsa7A6TLUljKFGX4BwH/gwfWKl3mAvFug7ScIGzJLSJdFmUrdZkylbjYXBAwyFvj3nj3k4x5aiiqykDDPwj4Zy5xiTLl/vvn1ePdGGkwQdiSm7wIRWbKq/RZi5kLAgbpshSMd/dggDH8g/P8oQV76TLHuw3ScoLUSG5puT2s7oaAIRAkBIzcggSkiTEEDIHUhYCRW+pqDyuNIWAIBAkBI7cgARmKYqzMhkA4IxC25Hb8yG5tn/eQds4dai4IGKwd3z7e/WDfuvHaMLGr4R8E/HfOe1j710+Kdxuk5QRhS24njh+TpwhFFW5tLggYHN61TPH9O354p9JH5jD8g4B/tjx1dcwfsOPbBmk5ftiSW1puVKt7KkPAipMiCBi5pQjslqkhYAgkNQJGbkmNsMk3BAyBFEHAyC1FYLdMDQFDIPgInC7RyO10POzOEDAEwgQBI7cwaUirhiFgCJyOgJHb6XjYnSFgCIQJAkZuSdaQJtgQMARSEgEjt5RE3/I2BAyBJEPAyC3JoDXBhoAhkJIIGLmlJPqWdzAQMBmGQKwIGLnFCot5GgKGQKgjYOQW6i1o5TcEDIFYETByixUW8zQEDIEzEQi1eyO3UGsxK68hYAicFQJGbmcF0z8jbdi0VfVa94h2r43+XMeOHf9nxCT0+WH6bLW+eqCeeGV0EuaSukR//PWEaMzB/+Fn39TuPXuDWsgTJ6QNm7dqx67dZy13y7YduuX+J3X9nQ9r1V/rzzqdRUw6BIzcEojtocOHlSsqu34Y86Jzr7//hfBLoLh4J5sxd5HGT/lZTw29TVE5srmOFW8hIZhg05btatGorsMc7PfvP6hJP80Nak2OnziuD774XtNnLTgruUePHtOI50bp8tbN1LBudb0waoy279x9VmktUtIhELLklnSQnL3kI0eO+qP7Hm3dvlOHDh12CYvWvFgXde2vex59UTcMHqELr7hB5zRo74/mGzT1519Uq2U3VbjgMj36wtvas3e/f3+VqjS9Qn1uHaY16zbqkqsGqtnl16l+256as2CpHvPj1bn4GlVq0lloBzr1t/DX5Tq/bjWVLVVMzRrW0ax5i0+FhP9p/4GDDnPwOHb8uNKnT6effbIH5yaXXeewfOntT/TpNxMF8cz8ZbEefnZUNDCQ1vmX9vZx7ufwP3DwkO4b+bK7LnXepdrmt+fwp9/Q2AnTNWXGL7qoS3/VuLCbGnXoq3Ubt+jJl99Tz0EP6Idps5xMyPCP1evUoE41XdzsfG3dsUv79h9wYXZIOQSM3BKB/Ur/gR75wju6e8QLqlqxrNJFRip3VA69++wwFS6YT00a1Nb3Hzyv33/6XI3a99bmrTs0sM+V+m3aJ9q0ZZvrfLWqVNCDd96gI0ePuo6UM3tWDeh1hW6//moXp0ih/FGGGFAAABAASURBVLq8TXM9fNcArfdNYZ36u+7qy1SnWkV9N3mGBg9/Tm8+ed+pkPA/Tfxxjj94vOTqvWv3HpUpUVS//b5Kj983SL27tlPdGpXV44q2mjFnoY/ZFl3Rb7DuHNA9GpgNm7bo5r5ddWPvK5Q9W1ZN9jW/vLly6qev3tS0z18T8u/w41/ctIF+mrNAt1x3leaNf0/lSpfQ8pWrBaHecm03Nb+grpOZIX16vff8g/px9gI9/er76tSmhQrlz+vC7JByCBi5JQL7SuVK66lht+qd54Zp1FP3K0OG9EqXLp3y582tvb5WdtDXCDzPczkc8rU8NI3CBU4+9JXKldEqf25ms68lzJ6/xMUp4KfrdtklmrdomWbP/1XL/I5UrHABR3zE+fK7KS4eh7UbNusTXzOZNnOe3n7mAZUtXRzvNOE6XtzU1Xn0Cw/5UwM5tGTZH/pjzTofsyU+dr85DTdTxgw66GvTu/fsU4miheR5J9sBgJgvnbNwqR//V6dh7fbn7NDeMvrtB1EV8Qcm4uEyZczoNMOT1xm0e+8+FS6QT6VLFMHLueO+9vjV91M10Z8DbeET3sXNGvjPQaQLs0PKIWDklkTYt/If8IVLV4iFhqsG3KNnHrxNhXxi+/DL8br7kRe1/M816uB3UsyXEkUKOe2jRLFCTpurUvEc5fY1CbQRzJ30kemULWsWp4UEijtu0k96/s0xWvzbSl1z030adN8TgaDgnlOxNM/zFOFFiD/IpVTxwsrha76r127Qot9+1w09Ounxl9/Vc8PvIEq0mzxjror6BHbs+DFHQgxIB3wifOb1D9T/rhHKlTOHorJn0+JlK4XJiez3P/tO46fNVE1f044WdOoC0/eeR1/y5+jm64W3P1bf2x7U1m07T4XaKaUQOPlkpFTuIZxvkYL59cKIO/9RgzGvPuL8Kpcv45s+V+qS5g111009nanSvGFd/7qXenW5VP/r392Zss8+eLtaX9hQva9sJzrn3QN7qUn92rqyQysNu+N6tW7RUFd2bKUu7Vpq+OABTjaH9q2aaMwrj+ihwf119829XUfGP9xdVx+X67tfHl3NAb06iwWGT157TJc0a6hevll6z6A+Kl28iM4tW8rNxVWpcE50fC6eHnabLm/bQtde1VGjn39IFzY+T9dfc5k6XtLUYV65Qhl18sN7d71UPa+41DdLu7l5zc/ffFyYm7RJ5kwZFfhjzu+zN0bqiQducW1xa7+rlNNf5AmE2zllEDBySyDuPNDFixT8R2rmf/D0PE9F/fmywr62VtE3XyMiIvz5nSyOwDBpcuXMTjRVOKekCvtmDmSJSVTanz/KnzeXMI0K5MutvLmjhGlaomhBX6M4mYaE+FcqX1qVfNm4sv7CAv7h7nL7c5r58uSKrmZ+35TPkS2rwBTNmDYBL8z2VlcO0DvPDouOG7ggHJKirRhQSI+cooUKuPYgXlSO7Croz5uRHzJpi3P9tkqXLtIRF+1JPJzneYrZFrQpzwdh5lIOASO3lMPeck5CBMqXKaFxo59T7WrnJmEuwRRtsoKNgJFbsBE1eYaAIZAqEDBySxXNYIUwBAyBYCNg5BZsRE2eIWAIpAoE4iC3VFE2K4QhYAgYAglGwMgtwdBZQkPAEEjNCBi5pebWsbIZAoZAghEwckswdEFJaEIMAUMgiRAwcksiYE2sIWAIpCwCRm4pi7/lbggYAkmEgJFbEgFrYlMXAlaatIeAkVvaa3OrsSGQJhAwcksTzWyVNATSHgJGbmmvza3GhkDSIZCKJBu5paLGsKIYAoZA8BAwcgselibJEDAEUhECYU1u+7fO1LJvG5gLAgYJfWa3/f664R8E/Ff/1CehTZBm04UtuUVmzKUiF36u8r0OmQsCBqUvXxrvTpK9VCeV731U1gaJfwbLdPlT2Uu0i3cbpOUEYUtuablRre6GgCEgGbnZU2AIGAJhiYCRWwo368aNG3XgQKh/nTyFQQxS9kePHtXmzZuDJM3EpDQCRm4p3AKtW7fWhAkTUrgUlj0IrFmzRh07duTSXBggYOSWwo04d+5ctW3bNoVLYdmDQOnSpTV9+nQuzYUBAkZuYdCIVoU0g4BVNB4IGLnFAyyLaggYAqGDgJFb6LSVldQQMATigYCRWzzASoqoV1xxhaZMmZIUok1mPBFYu3atunfvHs9UFj21IpAYckutdQqpcrFSun79+pAqc7gWdu/evZo0aVK4Vi/N1cvILYWbfNu2beratWsKl8KyB4EKFSqI7SBcmwt9BIzcQr8NrQaGgCEQCwJGbrGAktq8rDyGgCEQfwSM3OKPWVBTjB8/XjbnFlRIEyyMObeJEycmOL0lTF0IGLmlcHvcdtttmjNnTgqXwrIHgU2bNmnIkCFcmgsDBIzcUrgRJ0+erFatWqVwKSx7EChZsqS+/fZbLs2FAQJGbinciLly5VKGDBlSuBSWPQhERkYqKiqKS3NhgICRWxg0olXBEDAE/olA2JLbiWMHtWfVZ9q+aKS5IGCwa/kb/3x6/sPn8K7lhn0QsOcZ3rn0ZR3e/ft/IB4qwclTzrAlt+NHD+jghmmKPLjPXBAw2LbwsXg/kYe2L9CB1WMN/yDgr30bdWjHkni3QVpOELbkRqOmy5RPOYu2MRcEDMAzIS5j9nKGfxDwz5a/YULgT9Npwprc0nTLWuUNgTSOgJGb0vgTYNU3BMIUASO3MG1Yq5YhkNYRMHJL60+A1d8QCFMEjNzCtGFTYbWsSIZAsiJg5JascFtmhoAhkFwIGLklF9KWjyFgCCQrAkZuyQq3ZWYIJD0ClsNJBIzcTuJgR0PAEAgzBIzcwqxBrTqGgCFwEgEjt5M42NEQMATCDIEkJ7cww8uqYwgYAiGCgJFbiDSUFdMQMATih4CRW/zwstiGgCEQIggYuSWwoY4cOaqlK/507o/V63T48JEESgpSsjQiZsfO3Q5zsF+9doMOHzHc00jTx7uaRm7xhuxkgm07dmnYU69p0o9z9P2UnzX44eeTtaPt2r1Xz735kd7/bJz63/XIyUKlgeOUn3/R82+OcbiPmzxDj73wtuYvWR7Umh8/cULjp87Ugl9XnJXcE378KTN+0cPPvqmRL72rRUvtF3PPCrgkjmTklkCADx46pM1bdqh9qyZqc2FD/TBtpo4ePaYvvpuixb+tdOdFv/2uG4c86hPQdy6X48eP6+sJ0zRkxAvauHmb81u3cYuGPfGaZs8/+SurkBZpXhv9uQvftGW7HnnuLT316vs6duy48+Pw8dgf/PyOqm6NyorKnl2f+Pf4h7tbt2GzMmfKIHC/pNn52ujjg+ZMvV9862P978FnHP6/LPpNaHb4Q1ZfjJvMZbR766OvNfCekQqkXblqrf730LMC9+M+zq++95kjUBJ89NV4vx0fE21+4OBBJ3fsD9O1ZNlKgnXk6FE98vwoXeyXJ0+unPpxzgLt23/Ahdkh5RAwcksE9pkyZlDhgvlUuEA+pU+f3kmiw3z45ffO7/3Pv9P1PTopS+ZMuufRl5yG99PshRrYt6t6DnpAhw4fVrset/hxLtdX46c5gmrbfZAeuL2fGtSppt63DhWdqGzpYjq/blVfK3hHgb+rLrtY/Xt0VrHCBfTK6E/VpsUFgaCwP2fPltXhDv4HDhxUZESEGzCaNaytqy5vrU++maidu/foi3FT3PmhZ95Q1ixZonEB+9rVKvo4X6fuA+/TmnUbBZm1bFxP8xb/pskz5qpGlQoqXqSghj75mtKnS6cRQwaoeO022rVnn+7ytXQGsPLnlHQyM/ht/9HLI1SpXGktXf6nCufP69rcBdohxRAwcksE9Ghm/f73sBvxP339MfdA547KoWF3XK+JP85W+TIlVLFsKbVr1VgvjPpIvyxepmYN6yh/nlz69r1nNPLFd3RN59aaNW+J0Ng8z1O2rJl9U+sdZcmUUY8MuUkHDh7S1z7xZcmcWT2vaPuP0k70zeKihQros28n/SMsXD2mz5qvR194S/c//opog6ic2XVjryvk+f/e+/Rbp1k1O7+OICk034d8gmrRqG40HI/dM1DHTxzX66M/1z6fHKfNnKfs2bO6tnl++J1qen5tpUsX6UgzMiJCmfy2yJolswb07Kyvvpuqlk3q67qrOipdZGS0TPl5/7VhkzZt3eY0x/2+XNlfiiIQkaK5h3jmVSqco5ceGSw6CxpUzOrkzJ5NLDow4U0HK1W8iLL5HWTHrt3OvJnnm00lihZSySKFfHOmgW7q3UX1albRPYP66v5b+wqtDw2jw8VNNfSO6zVh6ixd1KW/An/fT/5ZM+Yu8jtaPY3xtYaX3vkkEBT254Z1q+uOG7rr+eH/U8vG9cX8Z7NO/QTO119zmSpXKOMwKFW8sDBP27Vs4u4Dh2tvf0ir/lqvm/p0VWZf+6atdELau2+/Fvjzd/v3H/SpynPRAyTHze++6VqiWCFHaunTp8PLOczSEf58W6lihfXQnf21et0GpzG6QDukGAJGbgmEHpOoYrlS/0hdrVI554emwEQzc2WYSRBgkwa13Kj+0VcTNHPeYl3Wurmm+loDxPT91J+1aet2jZ0wXU++Olo5fHKE2Ob72h4mE3M57Vo2drI5ZPc1jcX+nN5Tftz3/EWFIQN74x32rlCBvCpWpEB0PYsXLahcvrbctX1LzV6wRCwuHDhwSL+tWOUGjAf9RZ9XHhsSHZ+LRvVq+CS2wmnMNX3zM51vdhYtnN/Nt33wxfc6dOiwKvgm5979+1Xdb09WZpnPy5cnSrWqnqt8eaMU4Wt0yMJ5nqd0PtkxX/fS2x+r+QV1RXsRZi7BCCQ6oZFbAiHM7U8cX9+90z9SD76xp/M7p2QxXdS4nkr7Glv9WlWcqVPRn5Pp1LaFSvoj/DWd2vgT4xk1wDenCubLIybHa1Qur4F9uggtsFzp4urV5VLVqV5RdatXEh3rvluvc7I5NKlfy5lRzPkxuX5ho/PwDnvXqF5NH6uG0fVsc+EFquET0O03XKNC/lxX2VLFhPmOKZktaxZdcF4N5cyRLTo+Fz19XCuVLy00tjv6dxca3sVNG4j2ISyvT2JN/YGojo87Jmj9WlVVIF9uDR88wE+TVXWqVVLGDCfnWJGHeXrrdd1U0M+/hd8OlzRrqEwZMxJkLgURMHJLIPhMItMpzkwOKQX8MDsvb9NckBZ+dILK5cuokd/hsmTOhJdK+qYpGhpx8cjnz8d163ixAmTFfesWDX3zs76vLZw0lYiHQ7u44tKLVK1iWW7ThMubO8oRTaCyDAzMuWXyzcuuHVo5goLwc/qaLXOVg67tFogafYbUwBzzlYGkvD83mj9vbjcYBdqPObbAdd0aldTxkmaO0NDyyC+m5oZgFjna+kTLoMO8KX7mUhaBiJTN3nI3BJIGAUzVq/2VU4graXIwqakdASO3s2shixWCCEREnK7phmAVrMiJQMDILRHgWVJDwBBIvQgYuaXetrGSGQKGQCIQMHJLBHjUd33MAAAQAElEQVSWNPgImERDIFgIGLkFC0mTYwgYAqkKASO3VNUcVhhDwBAIFgJGbsFC0uQYAqGEQBooq5FbGmhkq6IhkBYRMHJLi61udTYE0gACRm5poJGtioZAWkQgdZBbWkTe6mwIGAJJioCRW5LCa8INAUMgpRAwcksp5C1fQ8AQSFIEjNySFN7UJtzKYwikHQTCmtyOHd6hvZunmQsCBgntEof3rTb8g4D//u3zE9oEaTZd2JJbRPrsylmxnzKWamsuCBgUbjo63p0kS6FmylPvUcM/CPhnLt1RWQpeEO82SMsJwpbcvIh0Sp+9tNLnKGMuCBhkylMj3v0kMlMeZcxdNS3inwR1LqXIjLnj3QZpOUHYkltablSruyFgCEhGbvYUGAKGQFgiYOQWls1qlTIE0gYC/1ZLI7d/Q8fCDAFDIGQRCHly27t3r1566SVzhkGafQYmTZoUsgSUlAUPeXJbsmSJrrvuOnOGQZp9Bm6++WY1aNAgKXkiJGWHPLl5nifPSx3O86wcnmcYeF7yYxCS7JPEhQ55cktifEy8IWAIhCgCRm4h2nBWbEPAEPh3BIzc/h0fC02NCFiZDIGzQMDI7SxAsiiGgCEQeggYuYVem1mJDQFD4CwQMHI7C5AsiiGQNhEI7VobuYV2+1npDQFDIA4EjNziAMa8DQFDILQRMHIL7faz0hsChkAcCIQQucVRA/M2BAwBQyAWBIzcYgHFvAwBQyD0EUjz5LZlyxbt378/9FsykTU4ceJEIiVIwZARVyGSUnZceSa3f1qoY3JimmbJDVL78MMPdeedd+qhhx7S66+/npy4n3Ves2fP1m+//XbW8RMa8ZdffgmQ03+KWLFihRYvXqyZM2eeFnf69OnauXPnaX6JuaHeCxcu1LJly/6RV2LkJjbt8ePHtWrVKu3YsSOxok5L//zzz592bzeJQyDNktuECRP0yiuvqHz58ipVqpRuueUWvfHGGw7NH3/8UTxo27Ztc/cbNmxwnWvcuHGaM2eOeLiPHTumRYsW6eOPP9Zff/3l4n3zzTfuvGnTJtHRd+3apWnTpom4H3zwgSCQn376yaVDW/z222/11ltvae3atS7dvHnzRF74QR7IoRyvvfaadu/e7eLEdZg/f74LWrdunbZu3equKRfaAOelS5c6v5iHQ4cOiXTr16/X1KlTHbnx+3hff/21li9f7qJCLlyMHz9e1IfrBQsWiIGBcnEfcGPHjtWMGTP01VdfBby0cuVK4b9nzx7nR1ouAuWiDAcOHNDkyZPxPs2B2aeffurK+P333wuij0ko1JV60R4xEyITLCHHo0ePunqRb6DtiAvO3NM+1P+HH35QoL23b9/u8EAGcSHXgwcPOjngwsBIufAn71U+0YEfcWM6wngOaHfqe/jwYde+P//8s3suAnGpF/W4++67A152DgICaZLc6MA8cBdffLH4Law+ffqIztu4cWO999574iHjoW/VqpXr0Dzk119/vV588UVde+21ovPQiW+88Ua9+uqratOmjXg4kUWbQHojR450pDVixAj3W1v33nuvRo0apauvvlrPPfecy7dfv36OLAcOHOjSE96lSxdNnDhR+EFSdGA6D2SI7LjcbbfdpjVr1ui+++4TBErng1QhhTFjxog6fPTRR4JIkAEG5Ad5Pf30046E8O/evbvKli2rd999VwwAgwcPFnXPnj27hg0bRhRVq1ZNJUqUUO7cp3+NCZKAAPHv2rWrIwgICnm9evVyaSkfF/zAIsRHuSg78sEqJnkVKFBAOXPmJLoYcKhPQM6UKVM0evRoN2C8/fbb2rdvn4sHTtSXNiAc7B555BFHuhAaGjpESztmyZLFtSlthTYKPsih3fPkyePqz0Dz5JNPioEGonzqqadEWQsXLizSP/bYY2Iw8DxPDzzwgCtD4PDggw+6gQ1CBAewAd+oqCjX7gyuDF6Q2+bNm4X8QFo7Jx6BNEtuPKx0wgwZMjgU69at686QGx2Th5qRv2/fvo4QID60lcjISKe5QUJZs2YVHYkHt3jx4oKIEMIoz+jOSM1Di+YyefJkoRG0a9dOkAnk2rx5c+XPn99pJORLx3744YedRknepG/SpInatm0rOjqyMfvojMigQ+KHq127tuvos2bNcqSDHDrgrbfeqgEDBqhz585Cs/z999+JLogIQr/yyis1dOhQp70i86KLLlK5cuWULl06pwGi9T3++OMqXbq0KlWq5DrrOeeco7x587rO7YTFOFSuXFn169cXpHn++efr9ttvV+bMmZ32RTQ0ZDQ+NBrIG+JEfo0aNVSxYkVHWMTDQSKZMmXiUvXq1RNt9Oeffzr877jjDjcAXHHFFU4zDGi/f/zxh9CwqdeQIUNUtGhRRzq9e/fWJZdc4jQnBi7qc+655wqczjvvPLVv397VmYGrSJEiriyFChVybbpx40YdOXJEaF9c88zkyJFDnNH2+bHUmjVrqnr16o5EXYH9w//+9z8hmzbjeYC8mjZt6qwFflySQQicSdewYUNFRKTJ7ugjlTT/0ySaBQsWdNoHIzkdjAePTsRDygOLOYEDcgiHc/r06UWcwAOIhsCDSRgjeOAaMoPc8A84SJAOzj3ykcM12gGdhA56wQUX4OXyyJgxo+tIeJAfhOp5HrfiOl++fI5ciOc8/QMkASG3bt1aEBhmrOd5zpxFs3nzzTdd56PufnT3n87qeZ7TRAP1xUz3PM/9AKiL5B8or+d5AgP/9rQw7gMOMqWelBm/zz77TO190sDcC+BD2b/77jtXFsiFMqAlUr5VvnkHSZD2TEe9kcuZMAYK0qB9QnyQLf64QJyAlgqpUHbO5IccBiPP8wSGhFE+z/NIrjJlyrg6et7Je+d56gCupy7dCW2S8jM4USY0WhfgH7h+55133ABWrFgx30eOED3Pc+3IcwK2PB+UmXLJ/oKGQETQJIWYILSP999/35lcjPKYImhgaDhoFWhHjO6YJJ7nuYedKgYewOHDhzuTFbOtR48eziRklEYWmgPxPM87bTT2vL/loAmiSfFgY/6hGXje3+E87J7nObLDxMKkkf+HNoNp061bN9FBfS/3n/RoFeSPyda/f3/Xga655hpn2mXLls1pdHRiEmDuBTDAVIOAMM+5/uKLLxy5osFQD+LjPM/j5BxaDeaWuzl18Ly/w0lHWckDzYXzl19+KcgNgmVgQRPs1KmTonwzjfJAjKQ5Jc5pXWhqnudF44hcz/NE/YhPWshJp/6QjRZLW2Lm/vrrr07zpU6jRo1yRFOrVq3o9iSZ550st+edPNN+lBXtHpOacmIWMy9Hu1AGiIyBrFmzZmKQgqRoI9oTmTgGCnBiuoD5PeR53sk8PM9zGi0EzDQEz0LMupPeXOIQSLPkhnnIh2WqVq3qTIdnn33WaUNoPhdeeKHTZiA2HuwKFSoIExKomfOhM1111VWiY2LaEo9OgLmFBkbngvAwJTGHIBQ6IloMnQE5mGI33HCDm5d79NFH3bwdZaJzEs6cG+kbNWoktDs0RfzjcpQDk69KlSpOFiRNJ2Q+i84F8SErV65cTgSye/bs6RYOwID5RwiQejEHhNlEXZib8jzPmaDI9ryTnRMih/ydsFMH6haQ38+fT0QLq+6baiyO3HPPPc78RsMijI5PMkxHTErmLDFLMWvxxzEAoPHgT1nwg4A9zxMEj1aNtnfppZc6giEc+QHzE1nkw6LP3LlzxVxbE9/Mh2DR9ohPnWlftG9MY9qJdsW8x6S9/PLL3WITxARRDho0yBEt+NGuL7zwgqsXZN2yZUs3kCAXx/MAqZUsWVLggOYYyBfSo9xo7eRN+ZgeIJ254CAQTW7BERdaUpjnoNMx8UsnovRoEHQc/Oisnue5+RfmoghnDg7Tkk6B9sAkOw8uYXR2JszpvJAaDzDkABkysl922WWCOImLI/39998f7dexY0eRhjBIiWu0DAiAa/zjcpAbnZJw8gmQZJSvFTHvRqekkxEecHRqOhTEDZF4nic6KHVv0aKFiwYBe54nNBJIEMJ0Af6Buvun6P/UjXLgQd0gEQYD5vyYLwvEZ8CAZIiHu/nmm0U7MEfHfcB5nicWbSApyoc/UwecIVEGAHA6s16Ylcz1QdSUmzJTT+JiCpMe8uZMO+IHwUDGkBvaGRgwQHie54iTOT5wRMMnHXVFBgRHvZhfQw5hAceAR/syqNE2DHqkIRwTvkOHDqIe1In69/QHG8LMBQeBNE1uwYHQpIQbApBNuNUpLdbHyC2JWp2J68SITkj6hKRJTBlTQ9oz63zmfULKiMYZ33TByDe+eVr8f0fAyO0MfFhZZDL5DO9Yb9muwfYQlvSZNA9EYkIacyRwf9r5LG8wadiywJzOfyVh0yzbQjBr/ytuOIWzaID5GKgTK76Yf4H7fzuzz+7fwuMTxlwae9zIn8Uf5jfjk97iJg0CRm4+roy6TDqzc5yd7L6X28DJNQTDRlMmvFldZaKZTkUc5ltYNWMVjclt/HDIY78Vu9bZ4Ml2Afa1sQrLyhgrgOyJY/8brzCx0ZbtKEwqE44/cmI63mZg7xjES2cKhLHtg5U2Np8yMc/KK/eB8nzyySduAyybjtl6EEhHJ6TcrKyygMD+LupHfHbeU17KxmZg6sMWCMpFGjbHsjJIfMLBCYJn8px78iA9BEJ5IF8wJB0EQP3BBnnIIT4ODPAnbUDO/PnzXfmRQ/2pO/mCJW1BuoDzPE/M8a1evVpLlixx3uRB+RmIKCNywIl8WOhwkU4d8KMNwI/9fewFhKgC/pSddiAM3CgPeDGnx4IMmBOXBRzyRCzPB2moE+3MwhA4fP755+4tBRYpiGcu+AgYufmYspGTB5bOxZYISIC9S+yBQyNiNRSSYt8W4Wh3dBBW5tjLxAPLg++Lcv+5ptMij8UANuNOnjxZ3NPRIQ0edvJAHh0F+ZAmHY5O5QSdOpCGTo52CCmR7lSQWwGEmCBQysGqXqAD05mITz0gbwgmkA6ZdDq2M/DmBXny9gT1ggjZrU/HpLMij84IaSCfHf/gxYQ9Z8iK8hGfiXE6NvmRDlnsAUMu+9IgffKGRCABsAmUiTIgB5Jg5Rc5kAfbMMiXMiCHzcbUCewCaTmDO1tzIDHaCj8WAvCnjXkjgjwhajCjjYgTcBAgeFAnNHLKDka8UcLCCtttqB8yIHTSs6gB9rypQjiDDARM2ZFLXSg/Z1bFkc9KOvVABmWlLMQ1F1wEjNx8PHmFhtVEXqNq2rSp2+nPFgK2HwRWSf1oboc7IzSrrDycrESyAsaOflbZiINjJGdlkVVLVlbxgxjonGhsaHz4sbrGtgVW0CA45npYWWNFlvCAo6Oy8ZVyotmxZysQxvYFVnrZLkI52P9G+ejQdHQ0HLYkoI2wbSKQjlVC6oIZB5mzTYIwOiuyKDfh/LAAadn/xkQ7++goN3FxxC9ZsqTbmQ+ZBciK1UdWP8GQLSicKRednK0dEAmEzj4v5OBISyqpHgAAEABJREFUCxFQR8qEH2WhHNSLVUw0V8xvcMKfOLG7v31pD1YmIXfaAHJjtZLy/R1LAh/qSZ4QGGVgiwcrx2izEBNbNyAj2oM2o8wBGbQfdWMFlDzxJ5x4aLyQMe1C+7OCDCaszpMPcc0FFwEjNx9POjKjLR2NzseGUzQDHkQcGpMf7bT/+J/mEePG8zy3gVYx/njVifkhtjXwwMcIcpe8hgXxBUjGeZ46QJxsNWAvHtsO6JinguI8oTlAmmyzIB2kBOEEElAG8gvcx3VGc4Go6bRoJRADGmLM+JACW08YIMCSMM/zot9oYBtMoLOjgaG1MUdFB4esiI+DUNCE2f5Bp8cPQgtsbqVOvNeK1kvY2Ti0KtoKMxctjlfrYuIQkIGGyjYP9h8yYOBPndHG2JsGiaP9scUFDCBGtvmw1YS4sTnKy7ODRnzTTTcJjM6MR5wz/ew+OAgYufk40uHYlImWxsgOeUBudCT2gLFvjU7LfjU/untlh07HNaSEmYlpxj2OkZn4XAc6EmnRXBjBMSsxdwNxiI8mRb5oJHRstADyIB0vV/OzTGgvmEfcIzvguGe+EBLED3mQyTPPPCP2TvFuKoRE5yUch7bw8ssvizzr1Knj3icNkAiaFvWnc/MjAuz7o3OyqZX3RiEnz/PcC+TIoo7MbbHfjzpypm6UA0cdPM9zrx7x1gN1Y7M0hIFWhAwccSEh9pth8rOXDDmed3LjMNcMPMyn8XYG5MLrU6SN6Sgn7/yigUFEYEG52VsHjmjR7EnkzYJAOgYdiA1NmjcbINAAyWGmQsbIpK5obrztwB5ETHE040yZMrkBjflLNFjieN7JtxDIk/2DzEmy2ERbky/los6ed7J++JkLHgIRwRMV2pIwGTDhmBvjAec9TUwRSIh7OiLkQi3ZzMkOfa5xvOnASM41jg7LXBvXmCSQDvMrdCruMfOYU8LkIw4PPr8agnZGfszlMN+D5hUwUSkbJhtzUqSJ6SAitAMmqvFn5zvalud5bp6PeTe0jphEAJExf8Q8FxoXnROtlfQQC6u0THaj3dEJ0SjpmOAC4UFQaCXEZ1AgLoMEhEld2USLiQ/ZUTbyw0yGMJj0hyB5fYuNxMjA8YYGCySUibpCEmh3aHOEo3lBjtQHLQ/iwo8wHJiRD+YeZSAcWZ7nudfsMIWZ04TsaVPanHQ4Nh9j7kOcEBd448+mbIiYa+ZMOWOaUnZIj7bivV7m5QiDBNE8A1hD9LQ75SE9gxPmLXF54wMTGxLmPkRdqi22kVuqbZqkLRiaCnN1Z5sL2hCLDEy0o+mhsZ5t2uSKx0vqkEdy5Wf5pG4EjNxSd/skWekwt3kN6mwzwHzlt8xY1GAR5WzTJWc8tEbmFpMzT8sr9SJg5JZ628ZKZggYAolAINzILRFQhG9S5vHYjByMGvJTUCy6BEOWyTAEkhIBI7ekRDeZZLOLnlU7JsjZ+sBEP1sY2O7BYgMrqaxCskLKPZPgTGqzRYKfG2cvFwsGnJFFHO4pPpPgXAfis+rKSiBhOGSQN3HYKkI8XKAMLFIQjkzikwfhyKU8AT/KRFy2RnAOxCMd9UAGjjqShnKwgIGsgBz8zRkCAQSM3AJIhOiZzs1qK28NsKeNFUO2NKBdseLJah97ydhnx3YNVvJ4U4D9WqxIMo9GesiPRQO2V7Dtg9U/yIqVVDYREx8N8EyYWE3lTQXisAOf9Py0ED/5BKkii/KQnrRsNGalmHu2VvAKFT+oyVsfrKayookMNhcjh5VY9qARny0arFRDgORFXdjtz/Ya/JBvzhAIIGDkFkAiRM+8nlSqVCn3jQX2k7Fdg+0T7HHj9Sv2wDHJzv45trawnw9ti/1ivFZGtSEV9rJ5nieIEPLhxX3Ija0baE98M4LtDMTHBRwaIoTF5li2g/BmB9sfyIttGeTDthG2PZCGbR3s82PLBFs1IDZ2+0NU/H4eK7LE43UmtmQgnx3/yOE37Xg7AiLj4ypsroWQ2RbCBmzSmTMEAggYuQWQCNEzJhn7pCAASI7NqWhzbHLFdItZLcw7NggTl93yAcKJGYdr9rwhk3dA2aNHfF43I+xMx8ZaCMbzPPcLtaQjPsTDmTJxhnQV4483QtjMCoGyj44gz/NO+/lv/HCkD8hhLxp+bHAO+EN6ARmEmTMEQMDIDRRC2GES8vI1G0p5MZzNxeyYZ6Ms2lBg4zEmIHvb0L4gFMxUNLp/qzo7+CElNr6ycZZd+3HFZ6c975iivWFGep7nvufKhmU0K17RIi0vzrPJGG0REuX9Un6lF7OaMvFGBfFiOjbBEoYc3gTxPE+8V4pmyq5/XoFCVsw0dm0IGLmF+DOAyQf5QBaYarwyxYombwew+51Pz0Em/DwP92zC5XUyzFnMSd6S4Oe0gYHFBc7sf+MtC9JBirzdwC+H8F7rXXfdJb4rQDwcbwww18c1rxkxn8d+M+b7eMOCuTTygHiJgwaGTPJHDq+4QYaYwpjQbCzmTQveXEAbg7z4iXHejKCOkKTneUI+Zitx2bOH7LB0VqkEI2DklmDoUk9CtBbm2zARPe/kC+sQg+d50e/B8joQfpzRsjh7nieuMfGoDXI4e57nTMxAfOQiHxczvvw/zzspw790soiLIy7pA9fkRxzm3LjGxcyX+DjicPY8j0tX/tjkUA5k4Ah3ke1gCMRAICLGtV0aAkmOAGZqkmdiGRgCPgJGbj4I9t8QMATCD4H4kVv41d9qZAgYAmGKgJFbmDasVcsQSOsIGLml9SfA6m8IhCkCRm6psmGtUIaAIZBYBIzcEougpTcEDIFUiYCRW6psFiuUIWAIJBYBI7fEImjpQxkBK3sYIxDBC9bmiiulMODl9cDL4MF6zviZoZSqj+Wbcs+SYX869hH8qgQvJJtbo5TAgPcqz/z1jsSSHD8cyQvpKVEfyzNlniPD/XTc4TUzSxPLJJbeEDAE/hOBlIhg5JYSqFuehoAhkOQIGLklOcSWgSFgCKQEAkZuKYG65WkIGAJJjkCaJLckR9UyMAQMgRRHIKTIjZ+V5hdbY6LGL7fGvLdrQyDYCHzwwQfiF49ZgUM2H7jh14m5PtPxicJAPMLmzZunvn37chntsmTJEn1tF0mHQEiRW1ww8ECxpYLf++e7m3wdKa645m8IJAQBvuoV+FpYzPSB545PKq5fv158lpCfWY/5bdeY8QPXbP/h2xc8s3wXgi+SBcLsHBwEwoLc+D7A8OHDxfcr2d/Fl5WCA49JSRQCYZT4iiuuEN+qGDt2bHSt2HzNLwtPmDBBn376qb799lvxjQccXxqLjhjLBYR2//33u2cWOXy0J5Zo5pUIBMKC3Pgt/mPHjglSK1CggPv9/0RgYkkNgVgR4AtdfMQmYHbyMRxMTj7Iw8dulixZIr69iuObrQEhnnfyexCBe848s3wHAlLLmzev+/4E/uaCh0BIkRvfxOQzbpihQDB58mTx5aayZctqyJAh6t27t9555x0FHj7imDMEgoUAX/q6/vrrNXToUCcy5vQHz6XzPOPA5xH5risfqSZo69at4gPTDMIDBw7UddddJz5buH37doLNBRGBkCI3vsmZO3du8W3Lu+++W23atNGjjz6q+fPni0/PMXm7ZcsWxXzogoiViUrjCHieJz5XeOGFFzokeId3wIABzhzt06ePexYJ+PHHHxX4TCILXnzPlbh8ZZ/PJs6dO1d8v/WJJ54Q2t5vv/3mrA7SJsxZqtgQCCly8zxPgwYN0nvvvac777xTvEOJes/D9sYbb6hdu3aaOHGismXLFltdzc8QSBACXbp00Y033ujSoom9/vrrGjx4sJo3b+6IrXbt2vr555+dackq6ogRI6KfQc/zdM0114i5YFb6N2zYID5dWKtWLTHXxgDNwgKfPHQZ2CFoCIQUuQVqnTlzZvfweJ4X8BJmAWar5/3tFx1oF4ZAEiLANpH/Eg+hMQ8X8xurfCeWZ5YB+r/SW3j8EQhJcot/NS2FIWAIpDUEkoDc0hqEVl9DwBBIjQgYuaXGVrEyGQKGQKIRMHJLNIQmwBAwBFIjAkZuqbFVzq5MFssQMAT+BYE4ye3IkSPifTlzM4KCA++8/ks7JFvQ3jVfadeKt8wFAYMj+/6Kd7sd2bfWsA8C9oFn+MSxg3G2QZzkxi5/9uawc9rcdiUGg02bNunXX3+NsxGSM2DLnHt0bNMvOrZ5vrlEYHDgzy91dM+qeDfdoW0LtPvXVwz7RGAfeHa3zb5bxw/vjrMN4iQ3UkRFRalp06bmEolBw4YNgTPVuFyluyl36avMnSUGsWGVvVALRabPkaA2zZK7hmGfCOwD7ZEuc8F/xf9fye1fU1qgIWAIGAKpGAEjt1TcOFY0Q8AQSDgCRm4Jx85SGgKGQDARCLIsI7cgA2riDAFDIHUgYOSWOtrBSmEIGAJBRsDILciAmjhDwBBIHQgYucXVDuZvCBgCIY2AkVtIN58V3hAwBOJCwMgtLmTM3xAwBEIaASO3kG6+cCi81cEQSBoEjNySBleTaggYAimMgJFbCjeAZW8IGAJJg4CRW9LgalINgdSGQJorj5Fbmmtyq7AhkDYQSHJyO3bsmNauXatDhw6lOkS3bt36r+U6fvx4qitzai7Qnr37tGzlai1ZtlK//b5KO3fvSZHi0m7H0lDb7dy1x2EO7kuW/aFDhw+nCO5xZXr06LG4gpLUP8nJbd++fXr66af1448/JmlFEiJ8+fLl7sPOb7/9dqzJ33rrrVj9zTN2BBYt/V2ffjNRW7fv1Io/1mjUh1/pj9XrYo+cRL5Hjx7V1JnzNPmnuUmUQ+oTO2PuIn3x3RSH+8Yt2/TQ029ow6atQS/o22PGarc/gMVH8Jp1G/XyO5/EJ0nQ4iY5uc2cOdN9YXvx4sXRhR41apSGDh2qX375xbmFCxe6sPnz52vKlCl69913NXbsWD3zzDPavHmzC/vuu+/04IMPup/8dh6nDrt27dK9996rN954Q1u2bNH777+vw/7ItWfPHn3yyUlQf/rpJxf2xRdf6P7779f48eNd6m3btmnOnDmC3F599VXnxwFt89NPP9U777zDrbmzRGDbjl066o/SjerXUtOGdXT8xAmN/WG6vp30k+597CUn5c8169Wx9+3+A/+p9u0/4PwGD39ePQc9oJm/LHL3Y76aoCtvGKL5S5a5+/lLlqv3LUP11KujtWfvfp3w5Xbq+z8nc/PWHS4OB/Ib8sgLGv7MG5ox9+QzhX+4u40+oWXIkEGN69dSkwa1BCY/zl6gLdt2aMRzo3RZnzu0yY+z/8BBvfjWxw6Oz76dpKUr/nTXHGi7R557S90G3K3FvuaN3959B1xbjXzpXdeGDz/7pgbc9YgOHzmip197X71vHebjfLLN7hz+rJ55/QP9MH02SZ1744Mv9JDfFu99+q27T+5DRFJnCHH07NlTOXLk0Jo1azRp0iTVqlVLXbp00aJFi8S3BfgZbh7YRx99VKVKldIPP+hMYq0AABAASURBVPyg/PnzK1u2bNqxY4fm+6Q3b948derUyf3c96pVq6KLfeedd+q6665TunTpXLy5c+f6HeyoI0kIdeXKlc70hED5LkSPHj0EeXGP5lagQAFFRkaqffv20TIjIiLcrw8jM9rTLs4KAR78vf7ovsonsQU+KVUqX1offv69mvlkh4A+fod49J6btHbDJqddXXv7g7qoyXnq3qmNvvx+mp5780MdOHhIQ+/op8HDn9Nf6zcJjfB/A3po/cYtztQ9t1EnjRhyo4oWyq/Rn41DrHMRnqcbe3VRu5ZN3H1aOmzzteWVq9ZqgT8gjPMHkwsb19Okn+Y4CB65+0Z16HWbe+4/+OJ75zdjzkKHrbvxD1u379Cx48c07Pbr9eKoMY4Yz2/XS7RVxvTptez31SqYL4/69+ysD/z2PHjwsG6//mp9M2G6Zs9fovc/+06NzqupOtUr+tJO/r/0osa65+Y+kqcU+YtIylyP+iYCmhXaEUQy3yepMmXKaMiQIc5M7dKli5o1a6Z9vum6xie+vXv3KkuWLMqVK5fq1Kmj8uXLa/Xq1Ro5cqQgMe4vueQSlSxZMrrYI0aMEN96mDx5siOxq6++2t2jeTVp0kTffPON9u/fr8aNGyt37twuDO2OOUDILmPGjE5Wvnz53JmD53muDJ4XvFa57bbblDlz5n+4QoUKqXv37v/wJ27VqlUd0VOmUHEQ0TOvfaBJP87W8MED1Oz8kxpcgby5XRUu8jvdOSWLOf+ICM8f6eeoaYPaTuN48H/X+51qp+icH/qdsHSJovp47A/CtOl3x3B1ad9KhQvmU/uLm6hZp37KHZVDA/zO5gSfOkB4+J+6TTOn+f5A8sEX3+nbiT9p1+69ypYls9q0uEDnnlNSvW8ZptkLfnUW1IWNztOCX1eobOniKuPjGwCoUP58qli2tG6482G95ZufDFKHfAKjrQb06qyBfbooQ4b0bkC5+d7H9b8B3VXBl73X71s7/fyO+hp79crllCNbVgX+8uaOcvED98l9jkjKDO+//349//zzatOmjSOroz7ZZcqUyZmOHTp00GOPPaaNGzfqr7/+cqYhpBdbeYoXL+4WJQ4ePCi0tt27d0dH69Wrl/r27asWLVo4v2rVqmnMmDFC+0L7w/QlzyeffFJZs2ZVnz591LlzZxc3OQ8Q9IEDB3Sm27Bhg956661/+BOPeiS2jMmdvlbVc3XXzb11Y+8uKuITEfmnTxcpzzs5UKzftAUvn8R2+J0lg3LlzK4dO3f75uY+zVmwVJ7/r+1FjTT4xl7q07W9+nfvpB5XtNU37z2jdz/5RhOmztLlrZvp958+17Ydu/XoC285eWn90PyCuhoysLdzg669Uu98PFbvf/6drwUf1gcvDVf+PLmVKWMGtbnwArXqOsCfEjioMiWLOtggsufe/EhbfO3t7WeHqk71Ss7/uE64KYBfl/8RbaoSULpEETfgoGHTzzL4mh3+qc1FJFWBMDMho2LFiil79uyqX7++y2r27NmaNWuWMBcrV67stKmGDRs60uIeU5A0RMYszZkzp26++WaNGzdOCxYs0IoVK5wZSTgOuX/88Ycze0lLnmh4aEOUoUaNGkJu6dKlxVwcGiQySIvWhIbUqFEjQZr4xXTlypWLeWvX/4FAlE9UhQvk9enp9IglixX2O9ZJDTl9+nSav3iZduzarRzZs6p/j076avw0zZq3xCe3X1W/dhVf0z7oaxpL9Nroz7V33359P+VnTZkxV8WLFNQ5pYrqxbc/8bWP5UJLqHpu2dMz8+9yR+VU4QL5/Ku08R8NqaBvMgZqW7l8GR08dFg5s2fzye2gps74xcetmI74ykVkRIRK+eQEloH4Ef7AU7JYIUFSE3+coyyZMyl9unS+dl1bcxcu1U+zF7oFiro1Kok505cfvUvvfTrO187nqJKfV7kyxVWtUtx95dxzSgWyStZzRFLmNmDAgGjxBQsWVIMGDZwZCqkQAKlAYMyBXX755cJE5J5rwjFhzz33XGEyduzYUXny5NEFF1zgNDDCcTfccAMnIatSpUpupLnpppscmWK+duvWTcyrXXbZZcqbN68z//r42hsE2rJlS1GuQYMGCRPVCYpxuPHGG2Pc2eV/IVDl3HN0SfPz/xHt6ssvUcH8uZ3/0Nv76YDf8Vo3b6g61SqqZ5dLVaVCGeXNE6Xru1+ulk3qq1G9GjrmmznPDr9DuXPl1KW+JpfJnz7ApKJTvv74PTp85KjfsUq7+Drjr44/73Nx0wZn+Ibvbf1aVdSiUd3oCqKdNa5fU03Pr+VjVEYtm9bX08Nu8/uGfIvGc1MAMeOjFIBx+TIl1LheTY28d6CicmTX88P/589fHxNaIdMJN/e9UpkzZVSNyhXUuW0L5fHbpl3LxiqUP68evuvvvq4z/m6//pozfJLnNsnIzfM8QS4xqwGRoClVqFDBLSowB7bFX+FkZbNevXpuUQCgIR7SQXQsRHie5zS8c845R6QnLOCYo8OfeKQjHHMUOYRBiIG4EGXZsmXdQgVlwRGfePgH4gXOprkFkDi7Mx2iUIF/akwxNTe0Ajpj0cIFooXWqFJB1SqWi75nPqhBnWpCo8CTTkRnreQvTqBR4NegdlVVrVhWaILcx3S5/bm4Qr4GGdMvya9TMIMzNTfmxs4tW8onnyihbdEu1X3Nyu9GbnHmyg6tnNYbs8jZsmZRPZ8kwY20yGChDT/MUOLSDkw7RER4zqQ9r2ZlP4+cBPntV9adYztUKFsyNu8k90sycjvbkqNNYZZGRUWdbRKLZwgYAglAIF1kpC71Na3KvimZgOQhlyTFyY3RIb0/Iel5XsiBZwU2BEIJAc/z3HxaKJU5MWVNcXJLTOEtrSFgCKQ1BM6+vkZuZ4+VxTQEDIEQQsDILYQay4pqCBgCZ4+AkdvZY2UxDQFDIIQQMHJLVGNZYkPAEEitCBi5pdaWsXIZAoZAohAwcksUfJbYEDAEUisCRm6ptWWsXDERsGtDIN4IGLnFGzJLYAgYAqGAgJFbKLSSldEQMATijYCRW7whswSGQPgiEE41M3ILp9a0uhgChkA0AkZu0VDYhSFgCIQTAv9Kbtu3b3e/gMuv4Jobl2As+OBNanpoti5/VVuXv2wuERjsXvu1jh3elaBm3bd1lmGfCOwDz+6R/ev/Ff84yY0fcezSpYv4IciUcuGSLz+Sycde/rUlkimwQP2nlLn0pcpUqq25RGCQvVI/pY/6+wc2z7b5MuWrrdw17zbsE4F94Nkt0PBFRWQ4+WOZseEfJ7nxS7Z8bIVOaa6qEosBP8oZWwMkt1+WQk2UrXhbc0HAIF3mgvFuvnSZCyhbiUtlbRCEZ9DH0YvMGGcbxElucaawAEPAEDAEQgABI7cQaKQkL6JlYAiEIQJGbmHYqFYlQ8AQkIzc7CkwBAyBsEQgTnLjA8bffPONzAUHg9g++pwST9TO317VtnkPmgsCBod3LY9nE0qHd60w7IOAfeAZPn50X5xtECe5HTp0SEuXLlW9evXMJRIDVp1TDbkte1VReRoqV97G5hKBQcbIHNLRA3F2rLgCDu/+XSf2rjfsE4F94Nndt/prnTi6Py6o/90sPX78uDJlymQukRhkzJhRYBlnKyRjwIljhxWRLou5RGLgeekT1monjsvzu521QeKfQZ04Jp04obj+4tTc4kpg/oaAIWAIpHIEXPGM3BwMdjAEDIFwQ8DILdxa1OpjCBgCDgEjNweDHQwBQyDcEDByS/oWtRwMAUMgBRAwcksB0C1LQ8AQSHoEjNySHmPLwRAwBFIAASO3FADdskwaBEyqIRATASO3mGjYtSFgCIQNAkZuYdOUVhFDwBCIiYCRW0w07NoQMAT+G4EQiWHkFiINZcU0BAyB+CFg5BY/vCy2IWAIhAgCRm4h0lBWTEPAEIgfAqFPbvGrr8U2BAyBNIJAkpPbjh071KdPH02cODHVQfriiy9qxYoVuuaaa/5RtrvuukudO3dW//79/xGWWjxmzJgh8E0t5flh2ixdeMUNzjVo20vdB96n7Tt3J1vxTpw4ofsff0WlzrtUjTr01ez5vyot/I35eoLqtLra4X5B+z6q1KSzkuLvmpvu1cYt285a9DOvf6AKjS5TuYYd9ezrH551umBFTHJy27hxo4oUKaLFixeLh48fbdyzZ48mTZokfu336NGjwlGhgwcPujj79+/XmjVrnDt27BhBrhP/+OOPOnDggIvjPP0DcSGo3377zckJyCAf5JMnMgL3U6dOFT+hzn3v3r1VqlQpbdq0yaX1xbn/o0aNUvfu3fXRRx/ppptu0vDhw51/ajv89ddf4oPPr7/+uvbu3XtaHVKirPsPHFSjejX1/Ycv6McvX1fr5g313Jsf+u18WJu3bndF2rxth8ZPmakFv67wy3vMuR0+AX701QQdOHhIR/325jz5pznas3e/a2vkzpizUMtWrnY/+nnAz2f+4mWaNnOe35ZHnFwOx4+f0Dc/TNefM79UY78cazdswjvs3d59B3RF+5Ya7+M+7fPXdGWHVnrjgy915MhRzVnwq+YuXKpde/ZGYwkghw4ddlhzjTt27LiWLPtDs+Yt0Z59J3HfuXuPa6uZvt9BP/7Gzdt08OBhJ2fVX+s18cc52u/3WXCnDHv9dH+uWYc45xjsJn38smaOHaWPvhrv/JLzkOTkds8996hHjx7Knj27I5F58+bp4YcfVs2aNfXyyy9r/PjxGjt2rN8QR5yGt3XrVnXq1Mlpeh9++KEWLlzoSI40+fLl01dffeWILgDSc8895z/ghzVnzhyNGzdOQ4cO1c6dOzV37lw99thjWr9+vSA0COyFF15wH1d+9tlnncb2xBNPaMqUKa6xSB+QWb9+fRUuXFi7d+8WBMJ1ICyh551+mZB1plu3bp22bdvm8jkzjIFhy5YtsYYRl3IWLVrU4Va8eHE9//zzguQh+ISWM+50ZxeycfNWzZizQJN/mqvVazeoTrVKuvm+xzX8mTedgMa+RpUlSya9PeZrfT1hmk9+H+nex15SpXKldJ9//mTsRN0+7Glly5ZFdS+5RktXrNLIl97Vuo2b9dZHX+uv9ZvU6sqbtGrtRm3yCXP0Z+OcXA4REZ6effAOpy3SmTOkT+Cv5SIsxNxqn2x+8geAgKtbvZK+m/Kzj9+fYnCoddFV2uuT4IVdTloiDzzxqmujQDWX/v6nvho/1cW9ccijPoa7VPq8S3XEVz6+mzxDDz/zhhzZTf1Zk3xSo00yZ8ygW+57Qr/5acv72tng4c/58Y85kSgVTzxwi/LmjtK8RcuUL08u55+chyQlt1WrVmnfvn3RBPXLL78oQ4YMKl26tObPn686deqodu3arnMTN0eOHPI8T+XLl3eE2KBBA0F2I0aM0LBhw1SuXDldfPHFTkYAJL5PgOaHNohf165dNXPmTH3yySe68MILHXlGRkYqc+bMTi5kh7YDcRG/UKFCLk++FcE9jvxEyiZYAAAQAElEQVQp3/Tp07Vy5UpXFvwT41avXq1Zs2b9w0HC5BFb2EKf2CGr2MICfmjFnuc5wr/55psduaekqfrb76s16sOv9eGX45U/b25d3KyBdu/dp2uv6ug/+EfVuH4tnV+nmlo2qa/s2bLqhVFj9OxDd6hcmRK6o393LV76u4oXKSjP/zfo2is1Y+5CFS6QVxt9raFcmeLKmSObqlcup/WbtviDz15VrVg2ulk8z1OO7FkdCRYplF8Vy5WODgv3CzS0tz76yq/7V9q//4CPbRaVLVVMeXJFqUjB/Dp46JDSp49UQx/76bPmq2zp4ipTokg0LLlyZle50iVUIF9urd2w2Y9/WIUK5NMlzc/X9ddcpuu7d1KunDncfZ/bhuk5v83q166qzJky+gPPFifHtaMvlxvP83TC16Tf/+w7jfW16UHXdsM7WV1EUuaGpsR8G+STwyeu/b65SWdt27atb6oc0pIlS/yG2C+0GrS0vn37/qM4jAB58uQR5IBJunbtWmeaBiK+9NJLCpid+FWpUkVjxozR9u3blTVrVmHKRkRECPnkT1k4EzcuB6lBgmXKlNF1110XV7R4+VeqVElt2rT5h2vZsqVq1KjxD3/iNmnSxH2ch+u43JEjR1w5cufO7QaAa6+9VuDlPFPg0KRBLb382BC99Mhgde/cxpUgkz+gRfhalU5Iu3xTB0+0ur2+GeP8fY+du/Y4MzMyMkLHjx/32/S4Vq5aq4L58/j3J1SjSgUtWLJCaIS+GNWueq6W/r7KN7l+81Of/E+6h5990ye1Uo4oSxUvfDIgDRwva9NCLz86xLl6tapo/NSZmuDPga74c43AVD7ZZPTboV3Lxrph8AifeI6rZLGT+KCd/TB9trb4UwaYsuAIZH4STvr9z798rP901xxKFS/qCJDrDL527ORzc4Z75+NvtG3HLj1+3yBdcF71M0KT/jZJye3XX3/VZZdd5hzzWxBGdt88ffzxx/X1119r8+bNypUrl5o3b67ly5erbNm/R+GYVe/Xr59ee+01DR48WJi12bJliw6mI7/33nvasGGDpk2b5kgwvQ94+/btHQmW8ufUqlatKjQ8JuA/+OADQZiQbEAI+d5///2BW/3888+aMGGCIGe0IfKODkzgRbp06cSHYmJzlDc2f7TcuMKI/+mnnzrze9SoUQ7P22+/XRAi6RJYzCRNlj59OpX0CafZ5f308y+LVc4f5d9+Zqi479b/bmdyXn15a9+c3ag7H3pWK1evU62q5+qwT+D3PPKiI78C+fKobMliLnzugqXK5JtGgUKjNX727WQ98txbau7ngYYSCAuhc6KLWszXfGf6+Kb3n7l3Ph7ra3Nf+33hoG9q7vY1uqzOVEQr8zzP5RUZEaECvpbNVMEX30/RHjfXKXXv1Ma1zSh/OqCgj3u2rFnUpd9deuyegaK9aLe8vrlZs3IFJyfm4ZdFv+mbidP1ydgfnIyb7hkZMzhZrpOU3EaPHh1dCTQ3NLMWLVro7rvvdlrGwIEDhT+aV8+ePd1XtgIaCAnr1q2rpk2bCtOLubsHHnhAHTt2FCYm4binnnpK9957r+68804RhzkoyPOiiy5yGtEtt9zi8kBWIF67du3EvB75Y4I+8sgjuvXWWxHnHCukI0eOdCYeeWLquoBUdjjvvPMc2Xfr1k3Mv0F4KVnElk3r69Z+V+lkl1H039PDbhMmEh73Duqrj14ZoaceuFXlfVO0bo1K7v79F4c707VMyaJ65O4bnd8bT9wrOlXfbu3d/bjRz4q5pH7dL3P3H7/6iDq1bYFY58r5ZMliAvJxxHUBYX7o2r6l+vfoFF3LXl0u1RP3D9I1nVpr3OjnNMg375f/+JlvVmbXocOHdW7ZkmrRqG50/Aif3Jo3rKMvRj2hQX2v1PgPnhdTAQP7dnU4j7x3oCqcU1KjnrpPn70xUjX8aYFPX3/MhQ3o2VlRvkm7aNLpq6FVKpyj7305n7/5uIs37PZ+0fkl10VEUmYEccWUDymhweCfM2dOZzaiJbHaB4ERBtCYk6RL72tgOK7R+EjDpwa5Dzi0OPw54yL9+TXSIwsXiI9c4pE3mg3+lCcQH/kBmfgTN+CQFwhLTWfmLlnsoA6poVyYKFkyZ/pHURjxA2XM7M/RMMmc3V8woE2IzH2eXDmjtbAc2bI67SJH9qwEC3OKOLjIyAihkXCdO0Ya+X/p0kW6dIThMmRI7/uG/3+0V3AN1JT77D6GnMGBa/Ddf+CQetz8gD/nWcNhGIjPmb5CXNoKsorwCY/2xI/0nudFa32e5/lzeTkd1oF8c0flQEy0S58+nU+mOVwcZOT050qjA5PpIknJ7WzqwEQ+q3zl/MWCs4lvcQwBQyBhCGTLmlmLfQ3ryg4tEyYgxFL9F7mFWHWsuIaAIWAInETAyO0kDnY0BAyBMEPAyC3MGtSqYwgYAicRMHI7iUOKH60AhoAhEFwEjNyCi6dJMwQMgVSCgJFbKmkIK4YhYAgEFwEjt+DiadJSOwJWvjSDgJFbmmlqq6ghkLYQMHJLW+1ttTUE0gwCRm5ppqmtooZAciKQ8nkZuaV8G1gJDAFDIAkQMHJLAlBNpCFgCKQ8AkZuKd8GVgJDwBBIAgTSCLklAXIm0hAwBFI1AkZuqbp5rHCGgCGQUATiJDd+1ZXvEfDlKHNT3Re0EooDX9biewwJbaRgpstd+SZt3zJR2zaPN5cIDA4e3yWlP/ljmvFpnwxR5aUcRQ37RGAfeHazlr5MXvpsccIfEVcIv1bbqlUrmQsOBiVKlIgL6mT1z1mul/JUuzOpXJqSmyHHOfFuO9IY/sF7/iLSZYmzDeIktzhTWIAhYAgYAiGAgJFbCDSSFdEQMATij0BIkxuf9Lv88svjX2tLkWoR4POLfG2M79Sm2kKmgoIlVxEWL16sxo0ba8yYMcmVZdDyCWly++uvvzRz5syggWGCUh6B7du3a/bs2dq/f3/KF8ZKoN27d7vFtLVr14YcGiFNbnyrFIILOdStwHEi0Lp1a/3+++8699xz44xjAcmHQIMGDXTixAkNGjQo+TINUk4hTW5BwsDEGAKGQBgiEBRyC0NcrEqGgCEQ4ggYuYV4A1rxDQFDIHYEQprcRo0apUsuuST2mplvSCIwffp0tW/fXn/++WdIlj/cCr1w4ULVrl1bo0ePDrmqhTS5sUR9xx13hBzoCS5wGkhYvnx53XLLLcqfP38aqG3qr2Lx4sX10EMPiYWF1F/a00sY0uRWqlQpNWnS5PQa2V1II5AvXz41atRIWbPG/73NkK54Ki18VFSUWrZsqZIlS6bSEsZdrJAmt7irZSGGgCGQ1hEwckvrT4DVPxYEzCscEAhpcvvss8903XXXhUM7WB1OIfDLL7+of//+CsUd8aeqEFanZcuWiVccv/7665CrV0iTG8B/8803IQe6FThuBDZs2KDvvvtOe/bsiTuShSQbAtu2bdMnn3yiFStWJFuewcoopMnNXr8K1mOQeuTY61eppy0oCaukSfj6FVkkmQtpcksyVEywIWAIhDwCRm4h34RWAUPAEIgNgTjJ7dChQ2LCfuzYsTKXeAz4pYvYGiC5/bYvekLbfnnAXCIx2Dr3Xh3euTTezXfIT7NlzhDDP5H48wxvmXWnjh/ZG2cbxEluhw8f1qJFi1SsWLG04pKsnuy2X7NmTZyNkJwBu1a8rczpCyhzhkLmEoFBxKG9On44/oseR3b/oaPbfjXsE4F94Nndt+pznTga9+/+xUludLjMmTPrnHPOMZdIDHiTAjxTi8ucp6ay5KllLhEYZMxeVhGRGRPUpBmyFDHsE4F9ljwnn92I9Nn/Ff9/Jbd/TWmBhoAhYAikYgSM3FJx44Rr0axehkByIGDklhwoWx6GgCGQ7AgYuSU75JahIWAIJAcCRm7JgbLlYQikBAJpPE8jtzT+AFj1DYFwRcDILVxb1uplCKRxBIzc0vgDYNU3BMIVgeQjt3BF0OplCBgCqRIBI7dU2SxWKEPAEEgsAkZuiUXQ0hsChkCqRMDILVU2S2IKZWkNAUMABIzcQMGcIWAIhB0CRm5h16RWIUPAEACBJCe3/fv3uw9MbN68mfxSlZs2bZq2bNkSa5n4/bV58+Zp3759sYab5z8RWLZytR574W3d99hLGv7Mm5o1b8k/IyWxz959BzT5p7lavXZDEuekVCN/3uJlDnNwv//xlzX1519SRdn49sJPsxdoxpyFKVKeJCe3gwcPatSoUZowYUKKVPDfMi1QoIAyZcqkoUOHnhZt1qxZ+vnnnxUVFaWXXnpJ1OG0CHYTKwLLfXL7dcWfql65vEqXKKIJ02Zp+qz5scZNCs/jx4/rjmFPK2uWTBr10dea+cvipMgm1cmcv2S5Vq/b6HCvXqm8Xn7nU02bOS/o5XzgiVe1fceus5b7wOOvKDJdOv3513oNGfHCWacLVsQkJ7cffvhBnTt3Pk1D6tOnj7p166Znn31W48aN08SJE119Pv30UxH/xhtvdITTtWtXLV++3IUNHDhQ3L/zzjvuPnCYPXu28+f7pVzfe++9OnDggPgk2YgRI1y08ePHa+PGjerVq5eLG/CfNGmSPvjgA02ZMkXk6SL7h7lz56pChQoqWbKkIzjufW/7fxYIlC5eRO0vbqrObVuoRNGCvhYxTy++9bGqtejqUo/5aoLKNuigq2+8VytXrXV+3Fds3ElDn3jN3d845FEXp+9tD7r7sT9Md/fnX9pLf63fpJWr17r7xh376rspP7s4Jw+eShYrpJpVz/UHpENav2mL0spf5QrnqIOPe/tWTVSuTAmt+GONpsz4RRe07+OwGjthuvbtP6Bu/e92kKBZT/15nrvmsGT5H6p7yTUuLm109NgxXwOe4+5JM+yp1/XKu5+qVqurtXffftVr3d2FjfrwK5Lr/Et7q37bnvp47A/ufptPgnnzROncsiXVpEEt/zlIfm0yyclt9OjRatq0qbJly6Zff/1V33zzjSAgNKJ69eopZ86c8jxPR44c0euvv65q1arpmA8sZNO3b19h1kJAzZs319tvv61y5cqJ75Xq1N/IkSP11ltvqXHjxtq0aZNy5colRnC+/5A7d24tXLhQ+fLlEx/7veGGG/TGG2+oVatWggh37Nih888/X+n80QWiPSVS119/vapWraqePXsKYqvnlzMQltDz0aNH/Q53MFZH3dEOz3T4JzS/lEo3d+FSDfc7wq33P6m3x4zVVZddrMkz5mr08w+5Ij349Ota8dNnqlyhtBb99rsqNemk5T9+qvEfPK/cUTl09yMvqEGdalo06UNFRHgaP3Wm1q3frPnjR+uugb2ULWsWVW7S2YUPvf16f9pgv5PLgfhXXX6JOvS6VVu27VCD2lXxThPuB19LfsjH9l5/SmDki++oZ5d22rRlm7p2aOmwuv7Oh/1+cUKrfHP9mK/hbt+5SwcPHYrGJmvmTLrluqtc3Hc++cZPu10det/u2qpFo/MUl3eucQAACQNJREFUlSObKpcvo+lfvKb7R76iF0YMdmELfl3h2miVr53N+OpNXd66uZOZJ1dODeh5hdr1vFXV/YHtqaG3Ov+EHBKaJknJbenSpSpSpIibc5s/f774SEpTn+ieeOIJDR482GlTkMjKlSvF/FblypVdPTAVIamMGTOKubovvvhCbdu2Vfr06VWjRg2VLl3axeMAAd12221C6+Me7QwC+/7771W3bl1BruvWrVOVKlW0YMECDfQ1wDO1P9LFdBs2bHDa3yjfnIY0OccMT8j1008/rUaNGv3DtW7dWg888MA//ImLf44cORKSXYqlqeVrTXfd3FtP+g/zd+8/p+JFCipblsyKjIzQEZ/gr2zfypWtRqUK/qASqUOHjrjBrWCBvH6HbKvIiEjd++iLatShj+YsWKqNm7cKDaBpp+v01fdTtdUnre/ef16NO/TVC2+NUZFCBZw8Dpu2bFe6yHT6ctSTKuTLmzF3Ed5pwjW/oK6GDOytobf3U2G/7itX/eVjkE+TfpzjsNy0dbsyZcygqzperMeef1to2NUrlXPYnDhxQtt37tb3k3/24/bVjLnMkZ1wcYjQqU0L9ejchkvnRn30lWpWqeCupROnzqefdu3eq63bd+qHD1/Usumf6uZ7Hz89QjLcRSRlHg8++KAzPSGUTp06ae/evU5juuqqqzRs2DD98ccfTttCc/roo480aNCgWItz6aWXCtNy1apVLv2+GJP8r7zyiu6++26nHaL5oCF+++23Kl68uD9SHRcLA1FRUU4rrF69uiPVSpUq+Z3q71GLTJHNGTdmzBhnHqMJQrCQKv6JcbfeequYyzvTYYaD05n+3FOOOnXqJCbbVJU2va8hfzvpJ630zdFZ85c4Iqtbo5LGTZqh+f6k+EdfjlfWrJl1ffdO+vzNx9XzirZqWLeGI78PXnpYBfLl0UJf25s+a55Gv/iQOl7c1J9b+tvcWfDrct038iUtWfaHNm/dIc//l6oASKbCXHXZJZowfZaWLF/pTNWHBw9QjmxZFeEPMDWrVtC9PkYMNPnz5nYlOnLkqCZOn62WTetr5L03q0jB/IKzVq/b4GO5Up/4pua0U3OnYIvpi5nL9AB9A43bCYpxWLN+o55+7X2nnS9YskIRvhYeIzhZLpOU3CA0z/NcRWrWrKmKFSsKUxFyWr9+vRo0aKCSJUuqWbNmypIli9BSsmbNqnbt2rk0pUqVUvny5XXFFVf45sc+N49GOKasi+AfIEq0O7Q+4mKSMqeHSVu4cGFxTViHDh20Z88eR2r4FypUSM19U5dFBebrDh8+7Es7+f/CCy90ZjSEFxERIdKeDLHjvyFQqXxpXdj4vH9QyhXtLlKgI3W+tIX+8h/8cqWLq0zJorrv1mu1xx+sGOmJ0+bCC1S2VHH9uXqdr+kd8wktt3L6JtGqNetVxZ9Xat6wjut8f63bpBzZs+kCn/x06u9C33yq5JtOK33ybFi3mir5pu+poLA+1a1eSU39ea1AJVs2qacGtaqqfq0qypcnl9PK7hzQwyesE8qeNYuYD41psqdLF6lmDWv7eGbVjl271a1DK/86m+6/9Tr/fo9rOzS9a6/uqIwZMmjEkBv9wWO71qzdqA6tmqhiudJ+O/YNZO/OtBWaIW1x0Dd/B/S6wvkn5yFJya19+/bRdUGjql69uiCaCy64QEWLFhVayZYtW9x3UZkHwxzli1uYgiSEhEqUKOGzfoSQhWlZ3ZfheR7BzkE8ZcqUEWmQzUjSsWNHR4oFCxZ0xAkZMpdXv359N2fXsmVLQZzknydPHhGfuTwn0D+ce+65zkzkjNaYPXt23/fkfzvGjUDpEkVVr2YVnfl3UeN6bj4N/35XX6Y6fmfscElTlfMJrrw/+d3JN3uYZ2vdoqEqli0lzlXOLatB116pLP5cUNMGtV2athdd4M/9ZFd330SqU72ir9VV13k1KyPWOc/zdP01l6vJ+bX8uaZWOqdkMecf7odK/qDCdECgnnVrVFbVimVVrWI5Na5XUx0vaaZbruum4775+fm4KSqYP69bdAnEZwCvUbmCmjesqzZ+G9za7yplz5bFnzPr7LdnZbXyNboK55TUZb6cxvVrKm/uKF3tz23W8duxvj+vmTlTRl17VceAuOjzZf78W7PzawuTmTaODkimiyQlt7jqAJgQDuF58+Z1K6fMj+GPX2zO8zxl8EeNM8M8zxOEiL/n/U163J/pMDHJw/M8R5j6lz/i5Qix+a5/qU6qCQLXrP4cHCZqzEIxHxS4j/BNmBzZswZu5Xme62xoDQFPZNABA/eBc2RkhDDB0kVGBrzS9DlDhvQCE8/z/PnISPXv0Un33NxHkRERp+HieZ4ypE+nSB+3iBhhTBl53j/7Ff7Z/CmE04TEchOVM7vObOtYoiWJV0SSSI2HUMCERAArHsksqiFgCMQTAc/znImfM0e2eKYMzegpTm6hCZuVOskRsAwMgUQiYOSWSAAtuSFgCKROBIzcUme7WKkMAUMgkQgYuSUSQEtuCIQ2AuFbeiO38G1bq5khkKYRMHJL081vlTcEwhcBI7fwbVurmSGQphFIZeSWptvCKm8IGAJBRMDILYhgmihDwBBIPQgYuaWetrCSGAKGQBARMHILIpghJMqKagiEPQJGbmHfxFZBQyBtImDkljbb3WptCIQ9AkZuYd/EVsGURMDyTjkE/pXc+JYAH20x97r7mfKE4vDuu++mXAvHkvO6ubdr7ZxbzSUCg63LX9LRgwn7utaudd8Y9onAPvDsHtrzeyxP999ecZIbP+d91113uU/hde3a1c6JwICfQudXgP+GPeWuirX8WgWavOm7N8w1STgGhS/6TJkKNIh3Q2Yp3FTFWk8w7BOBfYFTaUt2mKvITHnibIM4yY1f4+RXcs3lVTAwCPxacJwtkUwB6bIWVfrspc0FAYOIdFni3WqkMfyD9/zJizzZBrEc4yS3WOKalyFgCBgCIYOAkVvINJUV1BAwBOKDgJFbfNCyuIaAIRAyCBi5JUVTmUxDwBBIcQQitm3bJj5MbK5AiuDAJw2D/RQcOXJETZs2TZH62HOUMs+R4X467vDa/wEAAP//kO0kxgAAAAZJREFUAwDt4/sGJ/gBMQAAAABJRU5ErkJggg==>

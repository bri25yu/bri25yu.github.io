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

![Diagram comparing parallel execution on managed resources with concurrent requests to external resources][image1]

[image1]: {{ "/assets/images/parallel-vs-concurrent.png" | relative_url }}

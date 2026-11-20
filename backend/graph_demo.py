
from typing import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import create_react_agent
from chain_demo import model, tools


AGENT_INSTRUCTIONS = """
You are Kannada Saathi, an intelligent real-life Kannada assistant.

You have access to tools for translation, generating situation-based
phrases, and helping users communicate in real-life situations.

IMPORTANT RULES:
1. Read the complete request and understand its intended purpose.
2. Use the tool that matches the requested feature.
3. Always call a tool to generate the Kannada content.
4. Never use keyword matching or fixed, memorized phrase lists.
5. Use the full context provided by the user.
6. Do not invent tool results.
7. Return the selected tool's result clearly without unnecessary commentary.
8. Keep Kannada natural and practical for everyday conversation.
"""

agent = create_react_agent(
    model,
    tools,
    prompt=AGENT_INSTRUCTIONS
)


class State(TypedDict):
    feature: str
    user_input: str
    goal: str
    result: str


def run_agent(state: State):
    feature = state["feature"]
    user_input = state["user_input"]
    goal = state.get("goal", "")

    if feature == "translate":
        request = f"""
The requested feature is translation.

Translate this sentence into natural everyday Kannada.
Call the translate_to_kannada tool.

User sentence: {user_input}
"""

    elif feature == "situation":
        request = f"""
The requested feature is situation-based Kannada learning.

Call the generate_situation_phrases tool to create five
dynamically generated phrases for the selected category.

Category: {user_input}
User's specific goal: {goal if goal else "Not specified"}
"""

    elif feature == "ask":
        request = f"""
The requested feature is the real-life situation assistant.

Call the assist_with_situation tool.
Understand the user's actual goal and generate useful Kannada
sentences for that situation.

User's situation: {user_input}
"""

    else:
        raise ValueError("Unsupported feature.")

    response = agent.invoke({
        "messages": [
            {"role": "user", "content": request}
        ]
    })

    result = response["messages"][-1].content

    if not isinstance(result, str) or not result.strip():
        raise ValueError("The agent returned an empty response.")

    return {"result": result}


builder = StateGraph(State)

builder.add_node("agent", run_agent)

builder.add_edge(START, "agent")
builder.add_edge("agent", END)

graph = builder.compile()

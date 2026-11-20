
import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.tools import tool

load_dotenv()

api_key = os.getenv("GROQ_API_KEY", "").strip()

if not api_key or api_key in ("your_groq_api_key_here", "your_api_key_here"):
    raise ValueError(
        "GROQ_API_KEY is missing or unconfigured. "
        "Please create a .env file in 'backend/' with your Groq API key: "
        "GROQ_API_KEY=your_key_here (Get one for free at https://console.groq.com/keys)"
    )

model = ChatGroq(
    model="openai/gpt-oss-120b",
    api_key=api_key,
    temperature=0
)

parser = StrOutputParser()


translation_prompt = ChatPromptTemplate.from_template("""
You are an expert in natural, everyday spoken Kannada.

Understand the user's intended meaning and translate it into
natural Kannada that a person would actually say in real life.

Do not translate word by word if that sounds unnatural.

Return exactly this format:

Kannada: [Kannada sentence]
Pronunciation: [Kannada sentence written in English letters]
Meaning: [Meaning in English]

User sentence: {sentence}
""")

situation_prompt = ChatPromptTemplate.from_template("""
You are a practical Kannada language coach.

The user selected this real-life category: {category}
Their specific goal, if provided: {goal}

Understand the situation and generate 5 useful, distinct Kannada
phrases that fit the category and the user's goal.

If no specific goal is provided, generate 5 varied phrases for
common situations within that category.

Do not use a fixed phrase list.
Generate the phrases dynamically for this request.

For every phrase, provide:

Kannada: [Natural Kannada sentence]
Pronunciation: [Pronunciation using English letters]
Meaning: [Meaning in English]

Number the phrases from 1 to 5.
Use natural everyday Kannada, not overly formal language.
""")

ask_prompt = ChatPromptTemplate.from_template("""
You are Kannada Saathi, a practical real-life Kannada assistant.

Understand what the user wants to communicate, who they are
communicating with, and the situation they describe.

Generate 1 to 3 useful, natural Kannada sentences that help
the user achieve their actual goal.

Do not merely translate the user's description word by word.
Create sentences the user can genuinely say in that situation.

For each sentence, provide:

Kannada: [Kannada sentence]
Pronunciation: [Pronunciation using English letters]
Meaning: [Meaning in English]

Situation: {situation}
""")

translation_chain = translation_prompt | model | parser
situation_chain = situation_prompt | model | parser
ask_chain = ask_prompt | model | parser


@tool
def translate_to_kannada(sentence: str) -> str:
    """Translate a Hindi or English sentence into natural spoken Kannada,
    including Kannada script, pronunciation, and English meaning."""
    return translation_chain.invoke({"sentence": sentence})


@tool
def generate_situation_phrases(category: str, goal: str = "") -> str:
    """Generate five new Kannada phrases for a real-life category such as
    Travel, Shopping, Restaurant, or Healthcare. Use the user's goal
    when provided. Do not retrieve fixed phrases."""
    return situation_chain.invoke({
        "category": category,
        "goal": goal if goal.strip() else "No specific goal provided"
    })


@tool
def assist_with_situation(situation: str) -> str:
    """Understand a real-life situation and create useful Kannada
    sentences with pronunciation and English meaning."""
    return ask_chain.invoke({"situation": situation})


tools = [
    translate_to_kannada,
    generate_situation_phrases,
    assist_with_situation
]

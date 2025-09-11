import axios from "axios";
import * as cheerio from 'cheerio';
import OpenAI from "openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Document } from "@langchain/core/documents";
import 'dotenv/config'

const visited = new Set();



const openai = new OpenAI({
    apiKey: process.env.GOOGLE_API_KEY ,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export async function scrapeWebPage(url = '') {
    try {
            const { data , status } = await axios.get(url , {validateStatus : () => true});

            if (status >= 400) {
                console.warn(`⚠️ Skipping ${url} - status ${response.status}`);
                return null;
            }
            const $ = cheerio.load(data);

            $('script, style, noscript').remove();

            const pageHead = $('head').text().trim() || "";
            const pageBody = $('body').text().trim() || ""; 

            const internalLinks = new Set();
            const externalLinks = new Set();

            $('a').each((_, el) => {
                const href = $(el).attr('href');
                if (!href) return;
                if (href === "/") return;

                try {

                    if (!href.startsWith('#')) {
                        const resolved = new URL(href, url);  
                        
                    if (resolved.protocol === "http:" || resolved.protocol === "https:") {
                        if (resolved.origin === new URL(url).origin) {
                            internalLinks.add(resolved.toString());
                        } else {
                            externalLinks.add(resolved.toString());
                        }
                    }
                }
                    
                } catch (e) {
                    // skip invalid links
                }
            });

            return {
                head: pageHead,
                body: pageBody,
                internalLinks: Array.from(internalLinks),
                externalLinks: Array.from(externalLinks)
            };
        
    } catch (error) {
        console.error(`❌ Failed to fetch ${url}:`, error.message);
        return null;
    }
}

export async function insertIntoDb({headText , bodyText , webUrl , userCollectionName}) {
        
      const embeddings = new GoogleGenerativeAIEmbeddings({
                model: "text-embedding-004",
                apiKey : process.env.GOOGLE_API_KEY
    });
    
    const docs = [
    new Document({
      pageContent: `Web Page Head Or Section: ${headText}\n\nBody Or Content: ${bodyText}`,
      metadata: { webUrl },
    }),
  ];

    const vectorStore = await QdrantVectorStore.fromDocuments(docs ,embeddings , {
                    url : process.env.QDRANT_URL,
                    collectionName : userCollectionName,
                    apiKey : process.env.QDRANT_API_KEY 
    });

    console.log(`✅ Embedding successfull`);    
}

export function chunkText(text , chunkSize) {
    if(!text || chunkSize <= 0 || text === undefined) return []; //changed

    const words = text.split(/\s+/);
    const chunks = [];

    for (let i = 0; i < words.length; i += chunkSize) {
        chunks.push(words.slice(i , i + chunkSize).join(" "));
    }

    return chunks;
}

export async function injest(url = "" , userCollectionName) {
try {
    
    if (visited.has(url)) {
        // console.log("⏭ Already visited:", url);
        return;
    }
    visited.add(url);

    console.log(`🤯 Ingesting url : ${url}`);

    const result = await scrapeWebPage(url);
    if (!result) {
        console.warn(`⚠️ Skipping ingestion for ${url}`);
        return;
    }
    const {head, body, internalLinks } = result;

    if (!body || body.trim().length === 0) {
        console.warn(`⚠️ Skipping empty body for ${url}`);
        return;
    }
    
    const bodyChunks = chunkText(body, 2000);
    for (const chunk of bodyChunks) {
        await insertIntoDb({ headText : head , bodyText : chunk , webUrl : url , userCollectionName });
    }

    console.log(`✅ Done with url : ${url}`);

    for (const link of internalLinks) {
        if (!visited.has(link)) {
        await injest(link , userCollectionName);
    }
    }
   } catch (error) {
    console.error(`❌ Error while ingesting ${url}:`, err.message);
} 
}

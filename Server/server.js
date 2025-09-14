    import 'dotenv/config'
    import express from 'express';
    import cors from 'cors';
    import multer from 'multer';
    import OpenAI from 'openai';
    import { QdrantVectorStore } from "@langchain/qdrant";
    import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
    import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
    import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
    import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
    import { PPTXLoader } from "@langchain/community/document_loaders/fs/pptx";
    import { TextLoader } from "langchain/document_loaders/fs/text";
    import { injest , scrapeWebPage ,chunkText ,insertIntoDb  } from './utils/webEmbeddings.js';
    import path from "path"


    const client = new OpenAI({
        apiKey: process.env.GOOGLE_API_KEY ,
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
    });

    const embeddings = new GoogleGenerativeAIEmbeddings({
                model: "text-embedding-004",
    });

    const app = express();
    app.use(cors());
    app.use(express.json()); 


    const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
    });

    const upload = multer({ storage: storage });


    app.get('/' , (req ,res) => {
        res.json({
            msg : "working"
        })
    });

    app.post('/allDocs' ,async (req , res) => {
        const {userCollectionName} = req.body;
 
        const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings , {
            url : process.env.QDRANT_URL,
            collectionName : userCollectionName,
            apiKey : process.env.QDRANT_API_KEY 
         });

        const client = vectorStore.client;

        const docs = await client.scroll(userCollectionName , {
            with_payload : true,
            with_vector : false,
        })
        
        const rawFileNames = docs.points.map((doc) => {
                const source = doc?.payload?.metadata?.source;
                if (!source || typeof source !== "string") {
                return null;
                }
                return source.split("-").slice(2).join(" ");
            })
            .filter(Boolean);

        const uniqueFiles = [];

        rawFileNames.map((rf) => {
            if(!uniqueFiles.includes(rf)){
                uniqueFiles.push(rf);
            }
        } );

        res.json({
            uniqueFiles
        })
    });

    app.post('/upload/pdf' , upload.single('pdf'), async(req , res) => {
        try {
            const {userCollectionName} = req.body;

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        if (!userCollectionName) {
            return res.status(400).json({ error: "userCollectionName is required" });
        }

        console.log("File Data : ", req.file);
        
        const fileExtension = path.extname(req.file.originalname) ;

        if (fileExtension === '.pdf') {
            const loader = new PDFLoader(req.file.path);
            const docs = await loader.load();
            
            const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings , {
                url : process.env.QDRANT_URL,
                collectionName : userCollectionName,
                apiKey : process.env.QDRANT_API_KEY 
            });

           return res.json({
                filename : [req.file.originalname],
                msg : "pdf file Uploaded sucessfully"
            });
        }

        if (fileExtension === '.csv') {
            const loader = new CSVLoader(req.file.path);
            const docs = await loader.load();

            const embeddings = new GoogleGenerativeAIEmbeddings({
                model: "text-embedding-004",
            });
            
            const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings , {
                url : process.env.QDRANT_URL,
                collectionName : userCollectionName,
                apiKey : process.env.QDRANT_API_KEY 
            });

           return res.json({
                filename : [req.file.originalname],
                msg : "csv file  Uploaded sucessfully"
            });
        }


        if (fileExtension === '.docx') {
            const loader = new DocxLoader(req.file.path , {type : 'docx'});
            const docs = await loader.load();

            const embeddings = new GoogleGenerativeAIEmbeddings({
                model: "text-embedding-004",
            });
            
            const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings , {
                url : process.env.QDRANT_URL,
                collectionName : userCollectionName,
                apiKey : process.env.QDRANT_API_KEY 
            });

           return res.json({
                filename : [req.file.originalname],
                msg : "docx file Uploaded sucessfully"
            });
        }

        if (fileExtension === '.doc') {
            const loader = new DocxLoader(req.file.path , {type : 'doc'});
            const docs = await loader.load();

            const embeddings = new GoogleGenerativeAIEmbeddings({
                model: "text-embedding-004",
            });
            
            const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings , {
                url : process.env.QDRANT_URL,
                collectionName : userCollectionName,
                apiKey : process.env.QDRANT_API_KEY 
            });

           return res.json({
                filename : [req.file.originalname],
                msg : "doc file Uploaded sucessfully"
            });
        }

        if (fileExtension === '.txt') {
            const loader = new TextLoader(req.file.path);
            const docs = await loader.load();

            const embeddings = new GoogleGenerativeAIEmbeddings({
                model: "text-embedding-004",
            });
            
            const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings , {
                url : process.env.QDRANT_URL,
                collectionName : userCollectionName,
                apiKey : process.env.QDRANT_API_KEY 
            });

           return res.json({
                filename : [req.file.originalname],
                msg : "txt file Uploaded sucessfully"
            });
        }

        if (fileExtension === '.pptx') {
            const loader = new PPTXLoader(req.file.path);
            const docs = await loader.load();

            const embeddings = new GoogleGenerativeAIEmbeddings({
                model: "text-embedding-004",
            });
            
            const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings , {
                url : process.env.QDRANT_URL,
                collectionName : userCollectionName,
                apiKey : process.env.QDRANT_API_KEY 
            });

           return  res.json({
                filename : [req.file.originalname],
                msg : "pptx file Uploaded sucessfully"
            });
        }

       return  res.json({
                filename : [req.file.originalname],
                msg : "file not supported"
         });
        } catch (error) {
            console.log("Error While Uploading file : ", error);
            res.status(400).json({
                error : "Unable to Upload File"
            })
        }
    });

    app.post('/web' ,async (req , res) => {
        try {
            const {userCollectionName , url} = req.body;
            
            await injest(url , userCollectionName);

            console.log(`Sucessfully Injested web url : ${url}`);

            return res.json({
                msg : `Injested Successfull url : ${url}`
            })
        } catch (err) {
            console.log("Error While Uploading file : ", err);
            res.status(400).json({
                error : `Unable to Analysis url : ${url} `
            });
        }
    })

    app.post('/chat',async (req , res) => {
    try {

        const {messages , userQuery , userCollectionName } = req.body;
        
            const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings,{
                url : process.env.QDRANT_URL,
                collectionName : userCollectionName ,
                apiKey: process.env.QDRANT_API_KEY 
            });
            
        
            const vectorSearcher = vectorStore.asRetriever({
                k : 5,
            });
        
            const relevantChunks = await vectorSearcher.invoke(userQuery);
        
            const SYSTEM_PROMPT = `
            You are an AI assiant who helps resolving user query based on the 
            the content available to you from a PDF file or website data with the content and page number.
            
            Only answer based on the available context from file or webiste data only. 

                -Important 
                    1. You must provide detail answer related to provide content below if no content available poiltely responsed
                    with appropriate message to user
                    2 . Must tell and provide the url link in response so that user can navigate to that link
                    3. user might asked only related to either file content or website data appropriatly responsed back with availble content 
                       with matches user query  
                    4. Generate a well formatted and design response as i want to render this message to user make sure you are construting it as a markdown file i.e. readme.md
                    5. if you want to display code use markdown text to generate a terminal design which have the code 
                    6. frontend is of black-white theme so as per that response message design appropriatly so that user can see the response properly like modifiy the terminal bg color 
                    7. use colorful colors to display code or command that user can execute 
            
            File Content ||  Webiste Content :
            ${JSON.stringify(relevantChunks) || null}    


            `
        
            const response = await client.chat.completions.create({
                model: "gemini-2.0-flash",
                messages : [
                    {role : 'system' , content : SYSTEM_PROMPT},
                    ...messages
                ]
            }); 
        
            return res.json({
                msg : response.choices[0].message.content
            });
        
                
    } catch (error) {
        console.log(`Error while Chatting : ${error.message}`);
        return res.json({
            msg : "Server error Please try after sometime!"
        })
    }
    });




    app.listen(8000, () => console.log(`Server started on PORT:${8000}`));
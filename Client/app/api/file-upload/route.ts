import { NextRequest , NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';


    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });


interface CloudinaryUploadResult {
    public_id : string,
    [key : string] : any
}

export async function POST(request : NextRequest) {
    //Todo authentication check using useServer()

    try {

     if(
        !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
    ){
        return NextResponse.json({error : "Cloudinary credentials not found"} , {status : 500});
    }

      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const folderName = formData.get("folderName") as string;
       const fileName = formData.get("fileName") as string;

      console.log({file});
      console.log({fileName});
      
      if(!file){
        return NextResponse.json({error : "file not found"} , {status : 400})
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise<CloudinaryUploadResult>(
        (resolve , reject) => {
           const uploadStream = cloudinary.uploader.upload_stream(
                {   resource_type : "raw" ,
                    public_id : fileName,
                    folder : folderName,
                    raw_convert: "aspose"
                },
                (error , result) => {
                    if(error) reject(error);
                    else resolve(result as CloudinaryUploadResult);
                }
            )
            uploadStream.end(buffer);
        }
      )

    console.log(`upload coludinary url : ${result.secure_url}`);
    
    return NextResponse.json({
      success: true,
      fileUrl: (result as any).secure_url,
      public_id: (result as any).public_id,
    });
    } catch (error) {
        console.log("Uplaod file failed",error);
        return NextResponse.json({
            error : "Uplaod file failed"
        },
        {status : 401}
    );
    }
}
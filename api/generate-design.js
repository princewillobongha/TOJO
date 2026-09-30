export default async function handler(req,res){
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  try{
    const {prompt,style,garment,color,placement}=req.body||{};
    if(!prompt||typeof prompt!=="string")return res.status(400).json({error:"Please describe the design you want."});
    if(prompt.length>3000)return res.status(400).json({error:"Please keep the design brief under 3000 characters."});
    if(!process.env.OPENAI_API_KEY)return res.status(500).json({error:"TOJO AI is not connected yet. Add OPENAI_API_KEY in Vercel Environment Variables."});
    const finalPrompt=`Create a premium, realistic e-commerce apparel mockup for TOJO, a custom merchandise company.

Garment: ${garment||"Oversized T-Shirt"}.
Garment color: ${color||"Black"}.
Design style: ${style||"Premium & Minimal"}.
Print placement: ${placement||"Front + Back"}.
Customer brief: ${prompt}

Show the garment clearly, professionally lit, centered, clean studio background, realistic fabric texture, believable seams and folds, premium fashion photography, print artwork visibly applied to the garment. Treat the customer's description as the creative direction. Do not invent unrelated objects. Make the result look production-ready and suitable for a custom apparel approval screen.`;

    const response=await fetch("https://api.openai.com/v1/images/generations",{
      method:"POST",
      headers:{"Authorization":`Bearer ${process.env.OPENAI_API_KEY}`,"Content-Type":"application/json"},
      body:JSON.stringify({model:"gpt-image-2.5-sunburst",prompt:finalPrompt,size:"1024x1024",quality:"medium",output_format:"png",background:"opaque"})
    });
    const data=await response.json();
    if(!response.ok)return res.status(response.status).json({error:data?.error?.message||"Image generation failed."});
    const image=data?.data?.[0]?.b64_json;
    if(!image)return res.status(502).json({error:"The image service returned no image."});
    return res.status(200).json({image});
  }catch(error){
    return res.status(500).json({error:"Unexpected server error while generating the design."});
  }
}
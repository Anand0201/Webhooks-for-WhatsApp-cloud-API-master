const express=require("express");
const body_parser=require("body-parser");
const axios=require("axios");
require('dotenv').config();

const app=express().use(body_parser.json());
app.use(express.urlencoded({ extended : true }))
app.use(express.json());

const token='EAARBsuHJIXcBO4vOzkkC9yTXakbtmCd6qYJ637lFsLDVTu9vK9iyCpdvFSoA33XtTUKNdnwFx6sxIa4YuuqSEymvlkYzswCXf0hsiuKemPUtiGY0eo5sooArex4ZAxIuFF92s46tZCDZCVhSUNYWRpmDCFvyZCban2P3ZB9oZChveZA9PRS29q9j9ws1h2hkQPqDPOFddM7e5q64btQpkhx';
const mytoken='0TE';

app.listen(process.env.PORT,()=>{
    console.log("webhook is listening");
});

//to verify the callback url from dashboard side - cloud api side
app.get("/webhook",(req,res)=>{
   let mode=req.query["hub.mode"];
   let challange=req.query["hub.challenge"];
   let token=req.query["hub.verify_token"];


    if(mode && token){

        if(mode==="subscribe" && token===mytoken){
            res.status(200).send(challange);
        }else{
            res.status(403);
        }

    }

});

app.post("/webhook",(req,res)=>{ //i want some 

    let body_param=req.body;

    console.log(JSON.stringify(body_param,null,2));

    if(body_param.object){
        console.log("inside body param");
        if(body_param.entry && 
            body_param.entry[0].changes && 
            body_param.entry[0].changes[0].value.messages && 
            body_param.entry[0].changes[0].value.messages[0]  
            ){
               let phon_no_id=body_param.entry[0].changes[0].value.metadata.phone_number_id;
               let from = body_param.entry[0].changes[0].value.messages[0].from; 
               let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

               console.log("phone number "+phon_no_id);
               console.log("from "+from);
               console.log("boady param "+msg_body);

               axios({
                   method:"POST",
                   url:"https://graph.facebook.com/v13.0/"+phon_no_id+"/messages?access_token="+token,
                   data:{
                       messaging_product:"whatsapp",
                       to:from,
                       text:{
                           body:"Hi.. I'm Prasath, your message is "+msg_body
                       }
                   },
                   headers:{
                       "Content-Type":"application/json"
                   }

               });

               res.sendStatus(200);
            }else{
                res.sendStatus(404);
            }

    }

});

app.get("/",(req,res)=>{
    res.status(200).send("hello this is webhook setup");
});

app.post("/send-message", (req, res) => {
    const phoneNumber = '919328546083';
    const message = req.body.message;

    axios({
        method: "POST",
        url: `https://graph.facebook.com/v13.0/339788665888060/messages?access_token=${token}`,
        data: {
            messaging_product: "whatsapp",
            to: phoneNumber,
            text: {
                body: message
            }
        },
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        console.log("Message sent successfully:", response.data);
        res.status(200).send("Message sent successfully");
    })
    .catch(error => {
        console.error("Error sending message:", error);
        res.status(500).send("Error sending message");
    });
});
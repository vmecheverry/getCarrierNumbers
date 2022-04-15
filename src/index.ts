const  axios = require("axios");
const  xlsx = require("xlsx");
const  fs = require("fs");
require('dotenv').config();

async function execute(){
    const access_key = process.env.ACCESS_KEY;
    const base_path = process.env.BASE_PATH;
    const file = fs.readFileSync('data.csv');
    const workbook2 = xlsx.read(file);
    let xlData:any = xlsx.utils.sheet_to_json(workbook2.Sheets[workbook2.SheetNames[0]]);
    let rows=[];
    const delay = (ms:any)=> new Promise(res => setTimeout(res, ms));
    for(let i =0; i< xlData.length; i++){
    // for(let i =0; i< 10; i++){
        const phoneNumber =`1${xlData[i].Phone}`;
        const url = `${base_path}?access_key=${access_key}&number=${phoneNumber}`;
        const value = await axios.get(url).then((response: { data: any; }) => {
            return response.data;
        });
        let email ='';
        if(value.carrier==='AT&T Mobility LLC'){
            email = `${phoneNumber}@txt.att.net`;
        }else if(value.carrier==='T-Mobile USA Inc.'){
            email = `${phoneNumber}@tmomail.net`;
        }else if(value.carrier==='Sprint Corp.'){
            email = `${phoneNumber}@@messaging.sprintpcs.com`;
        }else if(value.carrier==='Cellco Partnership (Verizon Wireless)'){
            email = `${phoneNumber}@vzwpix.com`;
        }else if(value.carrier==='American Messaging Services LLC'){
            email = `${phoneNumber}@page.americanmessaging.net`;
        }else if(value.carrier==='MetroPCS Communications Inc.'){
            email = `${phoneNumber}@mymetropcs.com`;
        }else if(value.carrier==='United States Cellular Corp. (U.S. Cellular)'){
            email = `${phoneNumber}@uscc.textmsg.com`;
        }else if(value.carrier==='United Wireless Communications Inc. (United Wireless)'){
            email = `other email by ${value.carrier}`;
        }else if(value.carrier==='Cellular South Licenses LLC (C Spire Wireless)'){
            email = `${phoneNumber}@csouth1.com`;
        }else{
        email = 'other email'
        }
        let currentValue ={
            DotNo:xlData[i].DotNo,	
            LegalName:xlData[i].LegalName,
            Phone:xlData[i].Phone,
            valid: value.valid,
            number: value.number,
            local_format: value.local_format,
            international_format: value.international_format,
            country_prefix: value.country_prefix,
            country_code: value.country_code,
            country_name: value.country_name,
            location: value.location,
            carrier: value.carrier,
            line_type: value.line_type,
            email: email,
        };
        console.log(currentValue);
        rows.push(currentValue);
        await delay(300);
    }
    const worksheet = xlsx.utils.json_to_sheet(rows);
    xlsx.utils.book_append_sheet(workbook2, worksheet, "Carrier Info");
    xlsx.writeFile(workbook2, "data2.xlsx");
}

execute();
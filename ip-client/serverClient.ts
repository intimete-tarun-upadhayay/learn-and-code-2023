import io from 'socket.io-client';
import promptSync from 'prompt-sync';

const prompt = promptSync();
const socket = io('http://172.16.0.222:8081');

socket.on("connect",()=>{

    console.log("connected to server");

    socket.emit('Authenticate',{userId:'tarun.s@intimetec.com',password:'3004'});

    socket.emit('message','Hi Shiv, Tarun this from Learn & Code batch-6');
});

socket.on('Authenticate',(response)=> {
    response.options.map((item:string,index:number)=>{
        console.log(index + 1," ",item);
    })
    const selectedOption = prompt("Choose from above option : ");
    const categoryId = prompt('Enter Category ID : ');
    const name = prompt("Enter Item Name : ");
    const price = prompt("Enter Item Price : ");
    const availabilityStatus = prompt("Enter Availability Status : ");
    socket.emit('Option selection',{selectedOption: selectedOption,payload:{categoryId,name,price,availabilityStatus}});

    socket.on("Option Selection",(response) => {
        console.log(response.message);
    })
});

socket.on('message',(response) => {
    console.log(`Response back from Server side : ${response}`);
    
});
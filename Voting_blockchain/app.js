const express =  require('express');
const app=express();
const cors = require('cors');
app.use(cors());

const Web3=require('web3');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const router=express.Router();

const json = require('./build/contracts/Ballot.json');
const abi = json['abi'];
console.log(abi);
if (typeof web3 !== 'undefined') {
    var web3 = new Web3(web3.currentProvider)
  } else {
    var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'))
}

const contractAdd="0x3d68EFefbBf01fAa0B641e3f71A1bB901F9FB783";
var contract= new web3.eth.Contract(abi,contractAdd);
console.log('Server started in http://localhost:3000 in browser');

var deployerAddress
web3.eth.getAccounts().then(e=>{
    deployerAddress=e[0]; 
	console.log('Owner (deployer) Address: ' +deployerAddress)
});



//New Candidate
app.post('/addCandidate',async function(req,res,next){
    var candidateAddress=req.body.candidateAddress;
    var candidateName=req.body.candidateName;
    try{
        await contract.methods.addCandidates(candidateAddress,candidateName).send({ from: deployerAddress, gas: 150000 }).then(function(value){
            console.log('Registered candidates: ' + value.transactionHash);
            console.log(value);
            res.status(201).json({success:true,hash:value.transactionHash});
        })
    }
    catch(err){
        res.status(404).json({ success: false, error: err.message });
        console.log(err.message);
    }
});

//New Voter
app.post('/addVoter',async function(req,res,next){
    var voterAdd=req.body.voterAdd;
    try{
        await contract.methods.addVoter(voterAdd).send({ from: deployerAddress, gas: 150000 }).then(function(value){
            console.log('Registered user: ' + value.transactionHash);
            console.log(value);
            res.status(201).json({success:true,hash:value.transactionHash});
        })
    }
    catch(err){
        res.status(404).json({ success: false, error: err.message });
        console.log(err.message);
    }
});

//Vote
app.post('/vote',async function(req,res,next){
    var candidateAdd=req.body.candidateAdd;
    var voteraddress=req.body.voteraddress;
    console.log(voteraddress);
    try{
       await contract.methods.vote(candidateAdd,voteraddress).send({ from: deployerAddress, gas: 150000 }).then(async function(value){
        console.log('Voted: ' + value.transactionHash);
            console.log(value);
            res.status(201).json({success:true,hash:value.transactionHash});
       })
    }
    catch(err){
        res.status(404).json({success:false,message:err.message});
    }
});

//winningCandidate
app.post('/winningCandidate',async function(req,res){
    try{
       await contract.methods.winningCandidate().call({gas:130000}).then(function(value){
            console.log("Winner Details: "+value+"\n");
            res.status(200).json({success:true,winner:value});
        })
    }
    catch(err){
        res.status(404).json({success:false,message:err.message});
    }
});
//giveRightToVote
app.get('/giveRightToVote',async function(req,res){
    var voteraddress=req.body.voteraddress;
    try{
        await contract.methods.giveRightToVote(voteraddress).send({ from: deployerAddress, gas: 150000 }).then(function(value){
            console.log('Voted: ' + value.transactionHash);
            console.log(value);
            res.status(201).json({success:true,hash:value.transactionHash});
        })
    }
    catch(err){
        return res.status(404).json({success:false,message:err.message});
    }
});


//startVote
app.get('/startVote',async function(req,res){
    //var voteraddress=req.body.voteraddress;
    try{
        await contract.methods.startVote().send({ from: deployerAddress, gas: 150000 }).then(function(value){
            console.log('Voted: ' + value.transactionHash);
            console.log(value);
            res.status(201).json({success:true,hash:value.transactionHash});
        })
    }
    catch(err){
        return res.status(404).json({success:false,message:err.message});
    }
});

//endVote
app.get('/endVote',async function(req,res){
    //var voteraddress=req.body.voteraddress;
    try{
        await contract.methods.endVote().send({ from: deployerAddress, gas: 150000 }).then(function(value){
            console.log('Voted: ' + value.transactionHash);
            console.log(value);
            res.status(201).json({success:true,hash:value.transactionHash});
        })
    }
    catch(err){
        return res.status(404).json({success:false,message:err.message});
    }
});


/*//Buy Tokens
app.post('/buy',async function(req,res){
    var userAd=req.body.userAd;
    var reqTokens=req.body.token;
    var etherValue = (reqTokens * 0.01);
    await contract.methods.buyTokens(userAd,token).send({ from: userAddress, gas: 150000, value: web3.utils.toWei(etherValue.toString(), 'ether') }).then(function(value){
        console.log('Token Purchase: ' + value.transactionHash);
        res.status(200).json({success:true,userAd:userAddress,tokens:reqTokens,hash: value.transactionHash});
    }).catch(err=>{
        res.status(404).json({success:false,message:err.message});
    });
})
//Withdraw tokens
//Balance of user
app.get('/balance',async function(req,res){
    var userAd=req.body.userAd;
    try{
        await contract.methods.checkBal(userAd).call().then(function(value){
            res.status(200).json({balance:value});
        })
    }
    catch(err){
        res.status(404).json({success:false,message:err.message});
    }
})

app.get('/',function(req,res,next){
    res.send("Success");
});
//Getting rfid num
/*
app.post('/rfid',function(req,res,next){
    var rfidCode=req.body.uid;
    console.log(req.body);
    console.log("Someone accessed");
    console.log("UID"+rfidCode);
    if(rfidCode=="23024824484"){
        res.status(200).json({success:true,message:"Access granted"});
    }
    else{
        res.status(401).json({success:false,message:"Access denied"});
    }
});*/

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});
const mongo_id = process.env.atlasUser;
const mongo_pwd = process.env.atlasPassword;
let mongoURI = '';

if(process.env.NODE_ENV === 'production'){
		mongoURI = `mongodb+srv://${mongo_id}:${mongo_pwd}@cluster0-1ohwc.mongodb.net/test?retryWrites=true&w=majority`;
}
else
{	
		mongoURI = 'mongodb://localhost:27017/gigDApp'
}


module.exports = {
    abi : {
        factoryABI: '',
        pollABI: ''        
    },
    contractAddresses : {
        storeAddress: '',
        voterFactoryAddress: ''
    },
    db : {
        mongoURI: mongoURI
    } 
}

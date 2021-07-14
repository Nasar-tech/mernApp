const mongoose=require('mongoose');

const DB=process.env.DATABASE;

mongoose.connect(DB,{ useNewUrlParser: true,useUnifiedTopology: true,
    useCreateIndex:true,useFindAndModify:false})
.then(()=>console.log('Connection successful.. connected to database'))
.catch(err=>console.log(err));

const mongoose=require('mongoose');
const {dbname,dburi}=require('../../config');
 mongoose.connect(dburi,async (err)=>
 {
    useNewUrlParser: true
    useFindAndModify: true
    useUnifiedTopology: true 
    {

   if(!err)
   {
    await console.log(`Database connected ${dbname}`);
    } 
  else
    {
      console.log(err);
    }
  }
 })
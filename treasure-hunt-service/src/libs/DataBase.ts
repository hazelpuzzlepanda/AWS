import * as mongoose from 'mongoose';

class DataBaseServer {

  static open = (mongoUrl: string) => {
    
    return new Promise<void>((resolve, reject): any => {
      try{
        mongoose.connect(mongoUrl, { autoIndex: true });
        return resolve();
      } catch(e){
        return reject(e);
      }
       
    })
  }
  static disconnect = () => {
    console.log('Mongoose Disconnect');
    mongoose.connection.close();
  }

}

export default DataBaseServer;
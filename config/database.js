if(process.env.NODE_ENV === 'production'){
    module.exports = {
        mongoURI: 'mongodb://zain:zain1234@ds231529.mlab.com:31529/vidjot-provider' 
    }
}else{
    module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}
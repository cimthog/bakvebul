var constant=require('../constant/constant');
var constantAR=require('../constant/constantAr');

module.exports.checkLang= async function(req,next){ 
    // console.log('req.headers.language',req.headers.language);   
	if (req.headers.language == 'ar' || req.headers.language == 'AR') {
        await next(constant);
    } else {	
        await next(constant);
    }
}

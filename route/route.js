require('dotenv').config();

var express = require("express"),
    router  = express.Router();
const pool = require('../database');
const fetch = require('node-fetch');
var urlExists = require('url-exists');


router.get('/',function(req,res)
{ pool.query('CREATE TABLE IF NOT EXISTS report(year TEXT not null ,country text not null,product text not null,sales integer,PRIMARY KEY(year,country,product));',function(error, results){
    if(error){console.log(error);}
    else{
        console.log(" report table created");
    }
})
console.log("dtatabase",process.env.DATABASE_URL);
    res.render('home');
}
) 
router.post('/fetch',  function(req,res)
{
    urlExists(req.body.API, function(err, exists) {
        if(err){console.log(err);}
        else
        {
            if(exists){
                pool.query("SELECT count(*) FROM report;",function(err,count)
                { 
                    if(err){
                        console.log(err);
                    }
                    else
                   { 
                        var keys = Object.values(count.rows[0])[0];
                        if(keys >0){
                            req.flash('error', 'Already fetched ! please check the solutions.');
                            res.redirect('/');
                            }
                        else
                        {
                              fetch(`${req.body.API}`)
                              .then((response) => response.json())
                              .then((data) => 
                              {
                                     const neededKeys = ['year', 'country', 'petroleum_product','sale'];
                                     const check = neededKeys.every(key => Object.keys(data[0]).includes(key));
                                     if(check){
                                      data.forEach(element => {
                                        pool.query(`INSERT INTO report(year,country,product,sales)
                                         VALUES('${element.year}','${element.country}','${element.petroleum_product}',${element.sale});`, (err) => {
                                                if (err) {console.log(err);
                       
                                            }
                                 });
               
                    });
                    req.flash("success","Sucessfully Fetched ");
                    res.redirect('/');
                }    
                   else{
                    req.flash("error","Please provide API with matching keys ");
                    res.redirect('/');
                   } 
                })
                        }
                    
                }
            })
            }
            else{
                req.flash("error","Please provide valid url");
                res.redirect('/');
            }

        }
});

   
}
)   
router.get('/sales', function(req,res)
{
    const sql = "SELECT country,product,SUM(sales) AS sales FROM report WHERE sales !='0' GROUP BY country,product;";
    pool.query("SELECT count(*) FROM report;",function(err,count){
         if(err){console.log(err);}
         else
         {  
            var keys = Object.values(count.rows[0])[0];

             if(keys>0)
             {
                pool.query(sql,function(err,row)
                {
                    if(err){console.log(err)}
                    else
                    {  
                        res.render('display',{result:row})
                    }
                });    
             }
             else
             {
                req.flash('error', 'Please fetch data first.');
                res.redirect('/');
             }
         }
    })
    
})
router.get('/least',function(req,res){
    const sql = "SELECT c.year,c.product,c.sales from report AS c INNER JOIN (SELECT product,MIN(NULLIF(sales,0)) AS sales from report GROUP BY product)AS cmp ON c.product = cmp.product AND c.sales = cmp.sales ;";
    pool.query("SELECT count(*) FROM report;",function(err,count){
        if(err){console.log(err);}
        else
        {  
            var keys = Object.values(count.rows[0])[0];
            if(keys>0){
                pool.query(sql,function(err,row)
                {
                    if(err){console.log(err)}
                    else
                    {  
                        res.render('display',{result:row})
                    }
                }
                );  
            }
            else
            {
                
                req.flash('error', 'Please fetch data first.');
                res.redirect('/');
            }
        }
    })
})
router.get('/interval',function(req,res)
{
    const sql =  `SELECT product,CAST(min(year)AS TEXT) ||'-'|| CAST(max(year)AS TEXT) AS interval ,AVG(NULLIF(sales, 0)) AS Avg_sale from report  GROUP BY CEIL((year :: decimal)/2),product ORDER BY interval;`;
    pool.query("SELECT count(*) FROM report;",function(err,count){
        if(err){console.log(err);}
        else
        {  
            var keys = Object.values(count.rows[0])[0];
         if(keys>0)
         {
    pool.query(sql,function(err,row)
    {
        if(err){console.log(err);}
        else
        {
            res.render("display",{result:row});
        }
    }
    )
}
else
{
    req.flash('error', 'Please fetch data first.');
    res.redirect('/');
}
}})}
)
router.get('/remove',function(req,res)
{
    const sql ="DELETE FROM report;"
    pool.query("SELECT count(*) FROM report;",function(err,count){
        if(err){console.log(err);}
        else
        { 
            var keys = Object.values(count.rows[0])[0];
            if(keys >0){
               pool.query(sql,function(err){
                   if(err){console.log(err);}
                   else
                   {
                    req.flash('success', 'Successfully removed.Please fetch another API');
                    res.redirect('/');
                   }
               })
                }
                else{
                    req.flash('error', 'Database Empty.Please fetch API');
                    res.redirect('/');
                }
        } 
    })

}
)
module.exports = router;

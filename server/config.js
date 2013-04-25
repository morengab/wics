//configure auth with facebook server

Accounts.loginServiceConfiguration.remove({
    service: "facebook"
});

Accounts.loginServiceConfiguration.insert({
    service: "facebook",
    appId: "517024001689994", 
    secret: "4863fbfde35c254d4dba81e8b31f5492"
});
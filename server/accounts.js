Accounts.onCreateUser(function (options, user) {
    var accessToken = user.services.facebook.accessToken, 
        result, 
        picture,
        profile;

    result = Meteor.http.get("https://graph.facebook.com/me", {
        params: {
            access_token: accessToken,
            fields: 'picture'
        }
    });

    if (result.error) { throw result.error; }
    
    picture = _.pick(result.data,
        "picture"
    );

    result = Meteor.http.get("https://graph.facebook.com/me", {
        params: {
            access_token: accessToken
        }
    });

    if (result.error) { throw result.error; }
        
    profile = _.pick(result.data, 
        "id",
        "name",
        "first_name",
        "last_name",
        "gender",
        "email",
        "education",
        "email",
        "hometown",
        "location",
        "picture",
        "website",
        "work"
        );

    user.profile = profile;
    user.profile['picture'] = picture['picture'];

    return user;
});
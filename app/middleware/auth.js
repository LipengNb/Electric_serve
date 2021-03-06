'use strict';
module.exports = () => {
  return async function(ctx, next) {
    let token = '';
    if (ctx.headers.authorization && ctx.headers.authorization.split(' ')[0] === 'Bearer') {
      token = ctx.headers.authorization.split(' ')[1];
    } else if (ctx.query.accesstoken) {
      token = ctx.query.accesstoken;
    } else if (ctx.request.body.accesstoken) {
      token = ctx.request.body.accesstoken;
    }
    let user;
    try {
      user = await ctx.checkToken(token);
    } catch (error) {
      ctx.returnBody(false, {}, 'Token无效， 请重新登录', 401);
    }
    if (!user) {
      ctx.returnBody(false, {}, 'Token无效， 请重新登录', 401);
      return;
    }
    ctx.request.user = user;
    await next();
  };
};

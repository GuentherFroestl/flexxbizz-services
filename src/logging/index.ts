/**
 * Created by gfr on 06.01.17.
 */

export const loggingHandler = async(ctx, next) => {
    const start = new Date().getMilliseconds();
    await next();
    const ms = new Date().getMilliseconds() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
};
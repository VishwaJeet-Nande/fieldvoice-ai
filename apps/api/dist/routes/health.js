export async function healthRoutes(app) {
    app.get('/health', async () => {
        return {
            status: 'ok',
            service: 'fieldvoice-api',
            timestamp: new Date().toISOString()
        };
    });
}

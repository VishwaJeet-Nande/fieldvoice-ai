import { CustomerService } from '../services/customer.service.js';
const DEMO_ORGANIZATION_ID = 'org-apex';
export async function customerRoutes(app) {
    const customerService = new CustomerService(app.prisma);
    // ============================================================
    // GET /api/customers
    // ============================================================
    app.get('/customers', async () => {
        const customers = await customerService.listCustomers(DEMO_ORGANIZATION_ID);
        return {
            data: customers
        };
    });
    // ============================================================
    // GET /api/customers/:id
    // ============================================================
    app.get('/customers/:id', async (request, reply) => {
        const customer = await customerService.getCustomerById(DEMO_ORGANIZATION_ID, request.params.id);
        if (!customer) {
            return reply.notFound('Customer not found');
        }
        return {
            data: customer
        };
    });
    // ============================================================
    // GET /api/customers/:id/intelligence
    // ============================================================
    app.get('/customers/:id/intelligence', async (request, reply) => {
        const customer = await customerService.getCustomerById(DEMO_ORGANIZATION_ID, request.params.id);
        if (!customer) {
            return reply.notFound('Customer not found');
        }
        const intelligence = await customerService.getCustomerIntelligence(DEMO_ORGANIZATION_ID, request.params.id);
        return {
            data: intelligence
        };
    });
}

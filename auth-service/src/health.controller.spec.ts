import { HealthController } from './health.controller';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(() => {
    healthController = new HealthController();
  });

  it('returns service health payload', () => {
    expect(healthController.health()).toEqual({
      success: true,
      data: {
        status: 'ok',
        service: 'auth-service',
      },
    });
  });
});

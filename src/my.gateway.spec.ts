import { Test, TestingModule } from '@nestjs/testing';
import { MyGateway } from './my.gateway';

describe('MyGateway', () => {
  let gateway: MyGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyGateway],
    }).compile();

    gateway = module.get<MyGateway>(MyGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});

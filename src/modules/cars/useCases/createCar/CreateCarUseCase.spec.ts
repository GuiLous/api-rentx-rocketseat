import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCarUseCase } from './CreateCarUseCase';

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('Create Car', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it('should be able to create a new car', async () => {
    const car = await createCarUseCase.execute({
      name: 'Name Car ',
      description: 'Description Car',
      daily_rate: 100,
      license_plate: 'ABC-123',
      fine_amount: 60,
      brand: 'Brand',
      category_id: 'category',
    });

    expect(car).toHaveProperty('id');
  });

  it('should NOT be able to create a car with existent license plate', async () => {
    await createCarUseCase.execute({
      name: 'car 1 ',
      description: 'Description Car',
      daily_rate: 100,
      license_plate: 'ABC-123',
      fine_amount: 60,
      brand: 'Brand',
      category_id: 'category',
    });

    await expect(
      createCarUseCase.execute({
        name: 'car 2 ',
        description: 'Description Car2',
        daily_rate: 200,
        license_plate: 'ABC-123',
        fine_amount: 120,
        brand: 'Brand2',
        category_id: 'category2',
      }),
    ).rejects.toEqual(new AppError('Car already exists!'));
  });

  it('should be able to create a car with available true by default', async () => {
    const car = await createCarUseCase.execute({
      name: 'Car available ',
      description: 'Description Car',
      daily_rate: 100,
      license_plate: 'ABC-111',
      fine_amount: 60,
      brand: 'Brand',
      category_id: 'category',
    });

    expect(car.available).toBe(true);
  });
});

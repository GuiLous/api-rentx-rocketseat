import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { MailProviderInMemory } from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory';
import { AppError } from '@shared/errors/AppError';

import { SendForgotPasswordMailUseCase } from './SendForgotPasswordMailUseCase';

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let mailProviderInMemory: MailProviderInMemory;

describe('Send Forgot Mail', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    mailProviderInMemory = new MailProviderInMemory();
    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProviderInMemory,
    );
  });

  it('should be able to send a forgot password mail to user', async () => {
    const sendMail = jest.spyOn(mailProviderInMemory, 'sendMail');

    await usersRepositoryInMemory.create({
      driver_license: '317837',
      email: 'raden@gisibfos.bv',
      name: 'Tommy Sherman',
      password: '839066',
    });

    await sendForgotPasswordMailUseCase.execute('raden@gisibfos.bv');

    expect(sendMail).toHaveBeenCalled();
  });

  it('should NOT be able to send an email if user does not exists', async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute('ohhec@bicrimzez.pm'),
    ).rejects.toEqual(new AppError('User does not exists!'));
  });

  it('should be able to create an user token', async () => {
    const generateTokenMail = jest.spyOn(
      usersTokensRepositoryInMemory,
      'create',
    );

    await usersRepositoryInMemory.create({
      driver_license: '537058',
      email: 'awcaoci@akgib.ee',
      name: 'Hattie McGee',
      password: '1234',
    });

    await sendForgotPasswordMailUseCase.execute('awcaoci@akgib.ee');
    expect(generateTokenMail).toBeCalled();
  });
});

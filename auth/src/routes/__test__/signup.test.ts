import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on succesful signup', () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'a@a.com',
      password: 'pword'
    })
    .expect(201);
});

it('returns a 400 if email is invalid', () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'asdddsss',
      password: 'pword'
    })
    .expect(400);
});

it('returns a 400 if password is invalid', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'p'
    })
    .expect(400);
});

it('returns a 400 if password or email is empty', async () => {

  await request(app)
    .post('/api/users/signup')
    .send({
      password: '12345p'
    })
    .expect(400);

  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com'
    })
    .expect(400);
});

it('returns a 400 if an existing email is provided', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'passphrase'
    })
    .expect(201);

  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'johntown'
    })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});

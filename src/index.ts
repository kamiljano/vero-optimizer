import Calculator from './vero/calculator';

(async () => {
  await new Calculator({
    headless: false,
  }).calculate({
    background: {
      taxYear: 2024,
      municipality: 'Helsinki',
      parish: 'Civil Register',
      yearOfBirth: 1989,
      spouse: true,
    },
  });
})();

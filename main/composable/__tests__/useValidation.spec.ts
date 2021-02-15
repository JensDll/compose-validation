import { ref } from 'vue';
import { useValidation } from '../useValidation';
import Form from '../../Form';
import {
  cleanupForm,
  getResultFormData,
  transformFormData
} from '../useValidation';

const testData = [
  [
    'without refs',
    () => new Form(),
    () => ({
      foo: {
        $value: 1,
        $rules: []
      },
      bar: {
        $value: '2',
        $rules: []
      },
      xs: [
        {
          foo: {
            $value: {
              a: 1,
              b: 2,
              c: {
                d: 4
              }
            },
            $rules: []
          },
          ys: [
            {
              foo: {
                $value: 100,
                $rules: []
              }
            },
            {
              foo: {
                $value: 200,
                $rules: []
              }
            }
          ]
        }
      ]
    })
  ] as const,
  [
    'with refs',
    () => new Form(),
    () => ({
      foo: {
        $value: ref(1),
        $rules: []
      },
      bar: {
        $value: ref('2'),
        $rules: []
      },
      xs: [
        {
          foo: {
            $value: ref({
              a: 1,
              b: 2,
              c: {
                d: 4
              }
            }),
            $rules: []
          },
          ys: [
            {
              foo: {
                $value: ref(100),
                $rules: []
              }
            },
            {
              foo: {
                $value: ref(200),
                $rules: []
              }
            }
          ]
        }
      ]
    })
  ] as const
];

describe('transformFormData', () => {
  it.each(testData)(
    'should add metadata to all form fields (%s)',
    (_, getForm, getFormData) => {
      const form = getForm();
      const formData = getFormData();

      transformFormData(form, formData);

      expect(formData).toEqual({
        foo: {
          $uid: expect.any(Number),
          $value: 1,
          $errors: [],
          $validating: false,
          $onBlur: expect.any(Function)
        },
        bar: {
          $uid: expect.any(Number),
          $value: '2',
          $errors: [],
          $validating: false,
          $onBlur: expect.any(Function)
        },
        xs: [
          {
            foo: {
              $uid: expect.any(Number),
              $value: {
                a: 1,
                b: 2,
                c: {
                  d: 4
                }
              },
              $errors: [],
              $validating: false,
              $onBlur: expect.any(Function)
            },
            ys: [
              {
                foo: {
                  $uid: expect.any(Number),
                  $value: 100,
                  $errors: [],
                  $validating: false,
                  $onBlur: expect.any(Function)
                }
              },
              {
                foo: {
                  $uid: expect.any(Number),
                  $value: 200,
                  $errors: [],
                  $validating: false,
                  $onBlur: expect.any(Function)
                }
              }
            ]
          }
        ]
      });
    }
  );
});

describe('cleanupForm', () => {
  it.each(testData)(
    'should call delete for every form field (%s)',
    (_, getForm, getFormData) => {
      const mockOnDelete = jest.fn();

      const form = getForm();
      const formData = getFormData();

      const mockForm = {
        onDelete: mockOnDelete
      } as any;

      transformFormData(form, formData);

      cleanupForm(mockForm, formData);

      expect(mockOnDelete).toHaveBeenCalledTimes(5);
    }
  );

  it.each(testData)(
    'should call delete for a subset of form fields (%s)',
    (_, getForm, getFormData) => {
      const mockOnDelete = jest.fn();

      const form = getForm();
      const formData = getFormData();

      const mockForm = {
        onDelete: mockOnDelete
      } as any;

      transformFormData(form, formData);

      const deleted = formData.xs.splice(0, 1);

      cleanupForm(mockForm, deleted);

      expect(mockOnDelete).toHaveBeenCalledTimes(3);
    }
  );
});

describe('getResultFormData', () => {
  it.each(testData)(
    'should discard everything except the value properties (%s)',
    (_, getForm, getFormData) => {
      const resultFormData = {};

      const form = getForm();
      const formData = getFormData();

      transformFormData(form, formData);
      getResultFormData(formData, resultFormData);

      expect(resultFormData).toEqual({
        foo: 1,
        bar: '2',
        xs: [
          {
            foo: {
              a: 1,
              b: 2,
              c: {
                d: 4
              }
            },
            ys: [{ foo: 100 }, { foo: 200 }]
          }
        ]
      });
    }
  );
});

describe('useValidation', () => {
  describe('form', () => {
    it('should add metadata to every form field (1)', () => {
      const { form } = useValidation({
        a: {
          b: {
            c: {
              d: {
                value: {
                  e: {
                    $value: {
                      foo: '',
                      bar: ref(10)
                    }
                  }
                }
              }
            }
          },
          f: {
            $value: '',
            $rules: [],
            x: 1,
            y: 2,
            z: 3
          }
        }
      });

      expect(form).toEqual({
        a: {
          b: {
            c: {
              d: {
                value: {
                  e: {
                    $uid: expect.any(Number),
                    $value: {
                      foo: '',
                      bar: 10
                    },
                    $errors: [],
                    $validating: false,
                    $onBlur: expect.any(Function)
                  }
                }
              }
            }
          },
          f: {
            $uid: expect.any(Number),
            $value: '',
            $errors: [],
            $validating: false,
            $onBlur: expect.any(Function)
          }
        }
      });
    });

    it('should add metadata to every form field (2)', () => {
      const { form } = useValidation({
        a: {
          b: {
            $value: 1
          },
          c: {
            $value: 2
          }
        },
        ds: [
          {
            e: {
              f: {
                g: {
                  $value: 'foo'
                },
                e: {
                  $value: 'bar'
                }
              }
            }
          },
          {
            e: {
              f: {
                g: {
                  $value: 'abc'
                },
                e: {
                  $value: 'def'
                }
              }
            }
          }
        ]
      });

      expect(form).toEqual({
        a: {
          b: {
            $uid: expect.any(Number),
            $value: 1,
            $errors: [],
            $validating: false,
            $onBlur: expect.any(Function)
          },
          c: {
            $uid: expect.any(Number),
            $value: 2,
            $errors: [],
            $validating: false,
            $onBlur: expect.any(Function)
          }
        },
        ds: [
          {
            e: {
              f: {
                g: {
                  $uid: expect.any(Number),
                  $value: 'foo',
                  $errors: [],
                  $validating: false,
                  $onBlur: expect.any(Function)
                },
                e: {
                  $uid: expect.any(Number),
                  $value: 'bar',
                  $errors: [],
                  $validating: false,
                  $onBlur: expect.any(Function)
                }
              }
            }
          },
          {
            e: {
              f: {
                g: {
                  $uid: expect.any(Number),
                  $value: 'abc',
                  $errors: [],
                  $validating: false,
                  $onBlur: expect.any(Function)
                },
                e: {
                  $uid: expect.any(Number),
                  $value: 'def',
                  $errors: [],
                  $validating: false,
                  $onBlur: expect.any(Function)
                }
              }
            }
          }
        ]
      });
    });
  });

  describe('onSubmit', () => {
    it('should discard everything except the value properties', async () => {
      const { validateFields } = useValidation({
        a: {
          b: {
            $value: 1
          },
          c: {
            $value: {
              a: {
                b: {
                  c: ref(2)
                }
              }
            },
            x: 10,
            y: '',
            z: false
          }
        },
        rules: {
          value: {
            value: {
              xs: []
            }
          }
        },
        ds: [
          {
            e: {
              f: {
                g: {
                  $value: 'foo'
                },
                h: {
                  $value: 'bar'
                }
              }
            }
          },
          {
            e: {
              f: {
                g: {
                  $value: 'abc',
                  x: '',
                  y: '',
                  z: ''
                },
                h: {
                  $value: 'def'
                }
              }
            }
          }
        ]
      });

      const formData = await validateFields();

      expect(formData).toEqual({
        a: {
          b: 1,
          c: {
            a: {
              b: {
                c: 2
              }
            }
          }
        },
        rules: {
          value: {
            value: {
              xs: []
            }
          }
        },
        ds: [
          {
            e: {
              f: {
                g: 'foo',
                h: 'bar'
              }
            }
          },
          {
            e: {
              f: {
                g: 'abc',
                h: 'def'
              }
            }
          }
        ]
      });
    });
  });
});

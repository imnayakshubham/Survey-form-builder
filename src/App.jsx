import { useCallback, useMemo, useState } from 'react'
import './App.css'
import { Button, Checkbox, Col, Drawer, Form, Input, InputNumber, Radio, Row, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'

function App() {
  const [formDrawer, setFormDrawer] = useState({
    isDrawerOpen: false,
    component: null,
    mode: null
  });

  const [inputform] = Form.useForm();

  const surveys = [
    {
      "name": "Rana Cannon",
      "guid": "714A67C7-5686-1B8F-A130-522C90ED3DB7",
      "company": "Nec Euismod In Corp."
    },
    {
      "name": "Theodore Beck",
      "guid": "6C237E44-45BD-ADDC-7055-50A01FC6156E",
      "company": "Ut Institute"
    },
    {
      "name": "Kenyon Yates",
      "guid": "07A698EA-741C-4892-60E7-B12D1635D2FE",
      "company": "Non Sollicitudin LLC"
    },
    {
      "name": "Berk Terrell",
      "guid": "2283752E-19C5-1189-7146-D6D231750379",
      "company": "Ut Mi Company"
    },
    {
      "name": "Dane Haney",
      "guid": "5E26A243-E5BD-F7A1-234D-26F1322E4571",
      "company": "Mollis Duis Sit LLC"
    }
  ]

  const [selectedSurvey, setSelectedSurvey] = useState(surveys[0])
  const [surveyItems, setSurveyItems] = useState({
    meta: selectedSurvey,
    surveyForm: []
  })

  const components = useMemo(() => [
    {
      label: "Input",
      value: "input"
    },
    {
      label: "Select",
      value: "select"
    },
    {
      label: "Radio",
      value: "radio"
    },
    {
      label: "Checkbox",
      value: "checkbox"
    }
  ], [])

  const getDefaultComponents = (survey) => {
    const type = survey.input_type === "select" ? survey.select_option_type : survey.input_type
    const placeholder = survey.placeholder
    console.log({ survey, type })
    switch (type) {
      case "input":
        return <Input type='text' className='w-full' placeholder={placeholder} />
      case "number":
        return <InputNumber type='number' className='w-full' placeholder={placeholder} />
      case "single_select":
        return <Select mode='single' className='w-full' placeholder={placeholder} options={survey.user_select_options} />
      case "multi_select":
        return <Select mode='multiple' className='w-full' placeholder={placeholder} options={survey.user_select_options} />

      case "radio":
        return <Radio.Group className='w-full' placeholder={placeholder} options={survey.user_select_options} />

      case "checkbox":
        return <Checkbox.Group style={{ width: '100%' }}>
          <Row>
            {survey.user_select_options.map((surveyOption) => {
              return <Col className='py-2' span={8} key={surveyOption.value}>
                <Checkbox value={surveyOption.value}>{surveyOption.label}</Checkbox>
              </Col>
            })}
          </Row>
        </Checkbox.Group>


      case "textarea":
        return <TextArea type='text' className='w-full' placeholder={placeholder} />

      default:

        return null
    }
  }

  const onClose = () => {
    setFormDrawer({
      isDrawerOpen: false,
      component: null,
      mode: null
    });
    inputform.resetFields()
  };

  const inputTypeSelectionOptions = useMemo(() => {
    return [{
      label: "Text Area",
      value: "textarea"

    },
    {
      label: "Text",
      value: "input"
    },
    {
      label: "Number",
      value: "number"

    }]
  }, [])

  const handleInputFinish = (formvalues) => {
    const values = { ...formvalues }
    if (values?.user_select_options?.length) {
      values.user_select_options = values?.user_select_options.map((option, index) => {
        return {
          label: option,
          value: `option_${index + 1}`
        }
      })

    }
    setSurveyItems((prev) => {
      const newState = JSON.parse(JSON.stringify(prev))
      newState.surveyForm = [...newState.surveyForm, values]
      return newState
    })
    onClose()
  }

  const selectOptions = useMemo(() => [
    { label: 'Single Select', value: 'single_select' },
    { label: 'Multiple Select', value: 'multiple_select' },
  ], [])

  const getSettingComponents = useCallback((component) => {
    const componentType = component.value
    switch (componentType) {
      case "input":
        return <div>
          <Form.Item
            rules={[{ required: true, message: 'Please input your Label!' }]}
            name={"label"} required label="Label">
            <Input type='text' placeholder='Your Question' />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: 'Please input your Placeholder!' }]}
            name={"placeholder"} required label="Placeholder">
            <Input type='text' placeholder='Your Placeholder' />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: 'Please input your Input Type!' }]}
            name={"input_type"} required label="Input Type">
            <Radio.Group options={inputTypeSelectionOptions} />
          </Form.Item>
        </div>
      case "select":
        return <div>
          <Form.Item
            className='hidden'
            rules={[{ required: true, message: 'Please input your Label!' }]}
            name={"input_type"}>
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: 'Please input your Label!' }]}
            name={"label"} label="Label">
            <Input type='text' placeholder='Your Question' />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: 'Please input your Placeholder!' }]}
            name={"placeholder"} label="Placeholder">
            <Input type='text' placeholder='Your Placeholder' />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: 'Please Select your Option Type!' }]}
            name={"select_option_type"} label="Select Option Type">
            <Radio.Group options={selectOptions} />
          </Form.Item>

          <Form.Item
            name={"user_select_options"} label="Add Options"
            rules={[
              {
                message: 'Atleast 2 Option is Required',
                validator: (_, value) => {
                  console.log({ value })
                  if (value.length >= 2) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject('Some message here');
                  }
                }
              }
            ]}
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Tags Mode"
            // onChange={handleChange}
            />
          </Form.Item>
        </div>
      case "radio":
        return <div>
          <Form.Item
            className='hidden'
            rules={[{ required: true, message: 'Please input your Label!' }]}
            name={"input_type"}>
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: 'Please input your Label!' }]}
            name={"label"} label="Label">
            <Input type='text' placeholder='Your Question' />
          </Form.Item>

          <Form.Item
            name={"user_select_options"} label="Add Radio Options"
            rules={[
              {
                message: 'Atleast 2 Option is Required',
                validator: (_, value) => {
                  console.log({ value })
                  if (value.length >= 2) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject('Some message here');
                  }
                }
              }
            ]}
          >

            < Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Enter your Unique Option Here"
            />
          </Form.Item>
        </div>

      case "checkbox":
        return <div>
          <Form.Item
            className='hidden'
            rules={[{ required: true, message: 'Please input your Label!' }]}
            name={"input_type"}>
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: 'Please input your Label!' }]}
            name={"label"} label="Label">
            <Input type='text' placeholder='Your Question' />
          </Form.Item>

          <Form.Item
            name={"user_select_options"} label="Add Checkbox Options"
            rules={[
              {
                message: 'Atleast 2 Option is Required',
                validator: (_, value) => {
                  console.log({ value })
                  if (value.length >= 2) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject('Some message here');
                  }
                }
              }
            ]}
          >

            < Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Enter your Unique Option Here"
            />
          </Form.Item>
        </div>

      default:
        return <>Select  a valid Option</>
    }


  }, [inputTypeSelectionOptions, selectOptions])

  const handlePublish = (selectedSurvey) => {
    console.log({ surveyItems, selectedSurvey })
  }


  return (
    <>
      <div className='p-2'>
        <div className='flex gap-2 p-2 items-center w-full'>
          {
            surveys.map((survey) => {
              return <div
                key={survey.guid}
                className='p-2 border-2 rounded-lg cursor-pointer'
                onClick={() => setSelectedSurvey(survey)}
              >
                {survey.name}

              </div>
            })
          }
        </div>

        {
          selectedSurvey &&
          <div className='survey__form__container h-screen p-4 border'>
            <div className='flex justify-between h-full'>
              <div className="left bg-gray-300 h-[90%] w-[70%] overflow-y-scroll p-2 ">
                <div className='flex justify-between p-2 border'>
                  <div>{selectedSurvey.name}</div>
                  <Button onClick={() => handlePublish(selectedSurvey)}>Publish</Button>

                </div>
                <div className=''>
                  <Form
                    name={selectedSurvey.name}
                    layout="vertical"
                  >
                    {
                      surveyItems.surveyForm.map((survey) => <div className='flex gap-2 w-full justify-between' key={survey}>
                        <Form.Item
                          className='w-full'
                          label={survey.label}
                        >
                          {getDefaultComponents(survey)}
                        </Form.Item>
                      </div>)
                    }
                  </Form>

                </div>

              </div>
              <div className="right bg-gray-400 h-[90%] w-[30%] p-2 overflow-y-scroll ">
                <div>
                  Form Elements
                </div>
                <div className='border w-full my-2'>
                  {
                    components.map((component) => <div className='p-2 border cursor-pointer' key={component.value}>
                      <div onClick={() => {
                        setFormDrawer({
                          isDrawerOpen: true,
                          component: component,
                          mode: "create"
                        })


                        if (component.value === "select") {
                          inputform.setFieldsValue({
                            select_option_type: "single_select",
                            input_type: component.value
                          })
                        }

                        inputform.setFieldValue(
                          "input_type", component.value
                        )
                      }}>{component.label}</div>
                    </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        }
      </div >
      {
        formDrawer.component &&
        <Drawer title={`Setting for ${formDrawer.component.label}`}

          placement='bottom'
          onClose={onClose} open={formDrawer.isDrawerOpen}>
          <div className='setting__container' >
            <Form
              name='setting_input_form'
              form={inputform}

              layout='vertical'
              onFinish={handleInputFinish}
            >
              <div className='options__setting'>{getSettingComponents(formDrawer.component)}</div>
              <div className="option__actions">
                <Form.Item>
                  <Button type='primary' htmlType='submit'>Add to Form</Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </Drawer>
      }
    </>
  )
}

export default App

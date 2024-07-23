
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Checkbox, Col, Drawer, Form, Input, InputNumber, Radio, Row, Select, Switch, notification } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useLocation, useNavigate } from 'react-router-dom';

export const SurveyEditor = () => {

    const data = useLocation()
    const { state: selectedSurvey } = data
    const [formDrawer, setFormDrawer] = useState({
        isDrawerOpen: false,
        component: null,
        mode: null
    });

    const navigateTo = useNavigate()

    const [inputform] = Form.useForm();
    const [surveyform] = Form.useForm();

    const [isPreviewMode, setIsPreviewMode] = useState(false)

    const [surveyItems, setSurveyItems] = useState({
        surveyForm: []
    })

    const [showSubmitButton, setShowSubmitButton] = useState(false)

    useEffect(() => {
        if (selectedSurvey) {
            setSurveyItems((prev) => ({
                ...prev,
                ...selectedSurvey
            }))
        }
    }, [selectedSurvey])

    console.log({ surveyItems })

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
        { label: 'Multiple Select', value: 'multi_select' },
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
        setIsPreviewMode(true)
        console.log({ surveyItems, selectedSurvey })
        setShowSubmitButton(true)
    }

    const handleFormSubmission = (values) => {
        console.log({ values, surveyItems })
        notification.success({
            message: "Your Survey is Submitted"
        })
        navigateTo("/")

    }

    return (
        <div>
            <div>

                {
                    selectedSurvey &&
                    <div className='survey__form__container h-screen p-2 border'>
                        <div className={`flex ${!isPreviewMode ? 'justify-start md:justify-between' : "justify-center"}  flex-col-reverse md:flex-row h-full`}>
                            <div className={`left bg-gray-300 h-[85%] md:h-[100%] ${isPreviewMode ? 'w-full sm:w-[75%] md:w-[50%]' : "w-full md:w-[70%]"} overflow-y-scroll p-2 `}>
                                <div className=' justify-between flex p-2 border-b flex-wrap gap-4 md:gap-0'>
                                    <div className='flex-bold text-lg'>{selectedSurvey.name}</div>
                                    {
                                        !showSubmitButton &&
                                        <div className='flex gap-2 items-center justify-end w-full sm:w-auto'>
                                            <Button disabled={!surveyItems.surveyForm.length} onClick={() => handlePublish(selectedSurvey)}>Publish</Button>
                                            <Switch disabled={!surveyItems.surveyForm.length} checkedChildren="Edit Mode" unCheckedChildren="Preview Mode" value={isPreviewMode} onChange={() => setIsPreviewMode(prev => !prev)} />
                                        </div>
                                    }
                                </div>
                                <div className='p-2'>
                                    <Form
                                        name={selectedSurvey.name}
                                        form={surveyform}
                                        layout="vertical"
                                        onFinish={handleFormSubmission}
                                        autoComplete="off"
                                    >
                                        {
                                            surveyItems.surveyForm.map((survey) => <div className='flex gap-2 w-full justify-between' key={survey.input_type}>
                                                <Form.Item
                                                    className='w-full'
                                                    label={survey.label}
                                                    name={survey.input_type}
                                                >
                                                    {getDefaultComponents(survey)}
                                                </Form.Item>
                                            </div>)
                                        }
                                        {
                                            showSubmitButton &&
                                            <div className='flex justify-end'>
                                                <Form.Item>
                                                    <Button type='primary' htmlType='submit'>Submit</Button>
                                                </Form.Item>
                                            </div>
                                        }
                                    </Form>

                                </div>

                            </div>

                            {
                                !isPreviewMode &&

                                <div className="right bg-gray-400 h-fit md:h-[100%] w-full  md:w-[30%] p-2 overflow-y-scroll ">
                                    <div>
                                        Form Elements
                                    </div>
                                    <div className='border w-full my-2 grid grid-cols-2'>
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
                            }
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
        </div>
    )
}

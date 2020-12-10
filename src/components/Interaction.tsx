/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable implicit-arrow-linebreak */
import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Progress, Row, Col } from 'antd'
import axios from 'axios'

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
}
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
}

const Interaction = ({
  isShowHistory,
  showHistory,
  historyProtein1,
  historyProtein2,
}: {
  isShowHistory: boolean
  showHistory: Function
  historyProtein1: string
  historyProtein2: string
}) => {
  const [isError, setIsError] = useState(false)
  const [isShowResult, setIsShowResult] = useState(false)
  const [protein1, setProtein1] = useState('')
  const [protein2, setProtein2] = useState('')
  const [interaction, setInteraction] = useState(0)
  const [protein1Name, setProtein1Name] = useState('')
  const [protein2Name, setProtein2Name] = useState('')
  const [form] = Form.useForm()

  const onFinish = async (values: any) => {
    let result = await axios.post('http://127.0.0.1:5000/api', {
      protein1: values.protein1,
      protein2: values.protein2,
    })
    let { name, probability, status } = result.data
    if (status === '200') {
      setIsError(false)
      setProtein1(values.protein1)
      setProtein1Name(name.protein1)
      setProtein2Name(name.protein2)
      setProtein2(values.protein2)
      setInteraction(Math.round(probability[0][1] * 1000) / 10)
      setIsShowResult(true)
      if (localStorage.getItem('history') !== null) {
        let data = localStorage.getItem('history')
        if (data) {
          localStorage.setItem(
            'history',
            JSON.stringify([
              {
                protein1: values.protein1,
                protein2: values.protein2,
                probability: Math.round(probability[0][1] * 1000) / 10,
              },
              ...JSON.parse(data),
            ])
          )
        }
      } else {
        localStorage.setItem(
          'history',
          JSON.stringify([
            {
              protein1: values.protein1,
              protein2: values.protein2,
              probability: Math.round(probability[0][1] * 1000) / 10,
            },
          ])
        )
      }
    } else {
      setIsError(true)
      setIsShowResult(false)
    }
  }
  useEffect(() => {
    if (isShowHistory) {
      onFinish({ protein1: historyProtein1, protein2: historyProtein2 })
      showHistory(false)
    }
  }, [isShowHistory])

  const onReset = () => {
    form.resetFields()
  }

  const onFill = () => {
    form.setFieldsValue({
      protein1: 'AAQ89084.1',
      protein2: 'NP_001009905.1',
    })
  }

  return (
    <>
      <Form
        {...layout}
        form={form}
        name='control-hooks'
        onFinish={onFinish}
        style={{ width: '50%', margin: '0 auto' }}>
        <Form.Item
          name='protein1'
          label='Protein 1'
          rules={[
            {
              required: true,
            },
          ]}>
          <Input />
        </Form.Item>
        <Form.Item
          name='protein2'
          label='Protein 2'
          rules={[
            {
              required: true,
            },
          ]}>
          <Input />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
          <Button htmlType='button' onClick={onReset}>
            Reset
          </Button>
          <Button type='link' htmlType='button' onClick={onFill}>
            Example
          </Button>
        </Form.Item>
      </Form>
      {!isError ? null : (
        <>
          <div className='spacing' />
          <div className='center'>
            <p className='error'>Protein is invalid</p>
          </div>
        </>
      )}
      {!isShowResult ? null : (
        <>
          <div className='spacing' />
          <Row>
            <Col span={24} className='center'>
              <Progress type='circle' percent={interaction} />
            </Col>
          </Row>
          <Row>
            <Col span={12} className='column-center'>
              <p className='text'>{protein1}</p>
              <p className='text'>{protein1Name}</p>
            </Col>
            <Col span={12} className='column-center'>
              <p className='text'>{protein2}</p>
              <p className='text'>{protein2Name}</p>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default Interaction

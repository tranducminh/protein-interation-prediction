/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable implicit-arrow-linebreak */
import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Progress, Row, Col, Menu, Dropdown } from 'antd'
import axios from 'axios'
import { DownOutlined } from '@ant-design/icons'

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
  const [visible, setVisible] = useState(false)
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
      onFill({ protein1: historyProtein1, protein2: historyProtein2 })
      showHistory(false)
    }
  }, [isShowHistory])

  const onReset = () => {
    form.resetFields()
  }

  const onFill = ({
    protein1 = 'NP_000519.2',
    protein2 = 'NP_064632.2',
  }: {
    protein1?: string
    protein2?: string
  }) => {
    form.setFieldsValue({
      protein1,
      protein2,
    })
  }

  const handleMenuClick = (e: any) => {
    if (e.key === '1') {
      onFill({ protein1: 'NP_000519.2', protein2: 'NP_064632.2' })
      setVisible(false)
    }
    if (e.key === '2') {
      onFill({ protein1: 'NP_001349.2', protein2: 'NP_006237.1' })
      setVisible(false)
    }
    if (e.key === '3') {
      onFill({ protein1: 'NP_000519.2', protein2: 'NP_003810.1' })
      setVisible(false)
    }
    if (e.key === '4') {
      onFill({ protein1: 'NP_061187.2', protein2: 'NP_057694.2' })
      setVisible(false)
    }
  }

  const handleVisibleChange = (flag: any) => {
    setVisible(flag)
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key='1'>Example 1</Menu.Item>
      <Menu.Item key='2'>Example 2</Menu.Item>
      <Menu.Item key='3'>Example 3</Menu.Item>
      <Menu.Item key='4'>Example 4</Menu.Item>
    </Menu>
  )

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
          label='o=pờ rô tê in'
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
          <Button>
            <Dropdown
              overlay={menu}
              onVisibleChange={handleVisibleChange}
              visible={visible}>
              <a
                className='ant-dropdown-link'
                onClick={(e) => e.preventDefault()}>
                Example <DownOutlined />
              </a>
            </Dropdown>
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

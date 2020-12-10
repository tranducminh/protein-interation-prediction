/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react'
import { Table, Tag } from 'antd'

const History = ({ showInteraction }: { showInteraction: Function }) => {
  const columns = [
    {
      title: 'Protein 1',
      dataIndex: 'protein1',
      key: 'protein1',
    },
    {
      title: 'Protein 2',
      dataIndex: 'protein2',
      key: 'protein2',
    },
    {
      title: 'Probability',
      dataIndex: 'probability',
      key: 'probability',
      render: (probability: number) => <p>{probability}%</p>,
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status: string) => (
        <Tag color='green' key={status}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ]

  const [data, setData] = useState<any>([])

  useEffect(() => {
    let localStorageData = localStorage.getItem('history')
    if (localStorageData !== null) {
      let data_: any = []
      let localStorageDataJson = JSON.parse(localStorageData)
      if (localStorageDataJson) {
        localStorageDataJson.forEach((data: any, index: number) => {
          if (data.probability > 50) {
            data.status = 'High'
          } else {
            data.status = 'Low'
          }
          data.key = index + 1
          data_.push(data)
        })
      }
      setData(data_)
    }
  }, [])

  return (
    <Table
      onRow={(record) => {
        return {
          onDoubleClick: () => {
            showInteraction(record.protein1, record.protein2)
          }, // double click row
        }
      }}
      columns={columns}
      dataSource={data}
    />
  )
}

export default History

// 嵌套饼图
import React from 'react';
import {
  Chart,
  Geom,
  Tooltip,
  Coord,
  Label,
  View,
  Legend
} from 'bizcharts';
import DataSet from '@antv/data-set';

class Sunburst extends React.Component {

  // 重新计算完成与未完成百分比
  // calcPercent = (data) => {
  //   // 用数组
  // }

  render() {
    const { DataView } = DataSet;
    const { title } = this.props
    const data = [
      {
        value: 251,
        team: '团队一',
        type: '1完成',
        per: '50%'
      },
      {
        value: 148,
        team: '团队一',
        type: '1未完成',
        per: '50%'
      },
      {
        value: 610,
        team: '团队二',
        type: '2完成',
        per: '50%'
      },
      {
        value: 434,
        team: '团队二',
        type: '2未完成',
        per: '50%'
      },
      {
        value: 375,
        team: '团队三',
        type: '3完成',
        per: '50%'
      },
      {
        value: 550,
        team: '团队三',
        type: '3未完成',
        per: '50%'
      },
    ];
    const dv = new DataView();
    dv.source(data).transform({
      type: 'percent',
      field: 'value',
      dimension: 'team',
      as: 'percent',
    });
    // const cols = {
    //   percent: {
    //     formatter: (val) => {
    //       val = `${(val * 100).toFixed(2)}%`;
    //       return val;
    //     },
    //   },
    // };
    const dv1 = new DataView();
    dv1.source(data).transform({
      type: 'percent',
      field: 'value',
      dimension: 'type',
      as: 'percent',
    });
    console.log(dv, dv1)

    // 重新计算完成与未完成百分比
    // const { rows } = dv1
    // rows.map(v => {

    // })


    return (
      <div>
        <Chart
          height={416}
          data={dv}
          // scale={cols}
          padding={[30, 100, 60, 60]}
          forceFit
        >
          <span style={{
            color: '#646972',
            fontSize: 16,
            fontWeight: 'bold'
          }}
          >
            {title}
          </span>
          <Coord type="theta" radius={0.5} />
          <Tooltip
            // showTitle={false}
            itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
          />
          <Legend
            name='team'
            position="right-bottom"
            useHtml
            g2-legend-marker={{
              position: 'relative',
              top: '-1px',
              width: '13px',
              height: '13px'
            }}
          />
          <Legend
            name='type'
            custom
            items={[
              { value: '完成', marker: { fill: '#86CCFE' } },
              { value: '未完成', marker: { fill: '#BEE8FF' } },
            ]}
            onHover={ev => { console.log(ev) }} // 自定义 hover 事件
            onClick={ev => { console.log(ev) }} // 自定义 click 事件
            useHtml
            g2-legend-marker={{
              position: 'relative',
              top: '-1px',
              width: '13px',
              height: '13px'
            }}
          />
          <Geom
            type="intervalStack"
            position="percent"
            shape='circle'
            color={[
              'team',
              [
                '#6395F9', '#62DAAB', '#657798', '#F6C022', '#E96C5B', '#6DC8EC', '#9967BD', '#299999', '#FE9D4E', '#F29DC8'
              ]
            ]}
            tooltip={[
              'team*percent',
              (item, percent) => {
                console.log(item)
                percent = `${(percent * 100).toFixed(0)}%`;
                return {
                  title: item,
                  name: item,
                  value: percent,
                };
              },
            ]}
            style={{
              lineWidth: 1,
              stroke: '#fff',
            }}
            select={false}
          >
            <Label content="team" offset={-10} />
          </Geom>
          <View
            data={dv1}
          //  scale={cols}
          >
            <Coord type="theta" radius={0.75} innerRadius={0.5 / 0.75} />
            <Geom
              type="intervalStack"
              position="percent"
              color={[
                'type',
                [
                  '#86CCFE',
                  '#BEE8FF',
                ],
              ]}
              tooltip={[
                'type*percent*team',
                (type, percent, team) => {
                  percent = `${(percent * 100).toFixed(0)}%`;
                  return {
                    name: type.substr(-3) === '未完成' ? '未完成' : '完成',
                    value: percent,
                    title: team,
                  };
                },
              ]}
              style={{
                lineWidth: 1,
                stroke: '#fff',
              }}
              select={false}
            >
              <Label
                type='scatter | treemap | map'
                content='team'
                labelLine={{
                  lineWidth: 1, // 线的粗细
                  stroke: '#C2C5CC', // 线的颜色
                  lineDash: [2, 1], // 虚线样式
                }}
                htmlTemplate={(text, item, index) => {
                  // text 为每条记录 x 属性的值
                  // item 为映射后的每条数据记录，是一个对象，可以从里面获取你想要的数据信息
                  // index 为每条记录的索引
                  const { point } = item
                  const { value, type, team } = point
                  let { percent } = point
                  const u = '未完成'
                  const f = '完成'
                  percent = `${(percent * 100).toFixed(0)}%`;
                  return type.substr(-3) === '未完成'
                    ? `<div style='width: 98px'><span style="font-size: 14px">${team}</span><br/><span style="font-size: 12px">${u}: ${value} (${percent})</span></div>`
                    : `<div style='width: 85px'><span style="font-size: 14px">${team}</span><br/><span style="font-size: 12px">${f}: ${value} (${percent})</span></div>`
                }}
              />
            </Geom>
          </View>
        </Chart>
      </div>
    );
  }
}

export default Sunburst

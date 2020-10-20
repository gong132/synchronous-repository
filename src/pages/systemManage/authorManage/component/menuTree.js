import React, { memo, useState } from 'react';
import { Checkbox } from 'antd';
import _filter from 'lodash/filter';
import _sortBy from 'lodash/sortBy';
import StandardTable from '@/components/StandardTable';
import { TableColumnHelper } from '@/utils/helper';
import { isEmpty } from '@/utils/lang';

const Index = memo(props => {
  const { allMenuList, selectedRows, setSelectedRows, setExpandedRow } = props;

  const [clickExpandedRows, setClickExpandedRows] = useState([]);
  // 递归找到当前节点的所有父节点(不包括当前节点)
  const findParentMenu = (menuArray, pid, newArr = []) => {
    const menuJson = _filter(menuArray, o => String(o.id) === String(pid));
    if (isEmpty(menuJson)) {
      return null;
    }
    _sortBy(menuJson, 'id').map(v => {
      newArr.push(v);
      findParentMenu(menuArray, v.pid, newArr);
      return v;
    });
  };
  // 递归找到当前节点的所有子节点(不包括当前节点)
  const findChildMenu = (menuArray, id, newArr = []) => {
    const menuJson = _filter(menuArray, o => String(o.pid) === String(id));
    if (isEmpty(menuJson)) {
      return null;
    }
    _sortBy(menuJson, 'id').map(v => {
      newArr.push(v);
      findChildMenu(menuArray, v.id, newArr);
      return v;
    });
  };

  const handleChangeCheck = (flag, rows) => {
    const childRows = !isEmpty(rows?.children) ? rows?.children : [];
    if (flag) {
      const parentArr = [];
      parentArr.push(rows);
      findParentMenu(allMenuList, rows.pid, parentArr);

      setClickExpandedRows(arr => {
        const hash = {};
        // 取原始数据与新选择的数的并集,并对数组去重
        const newArr = [...arr, rows, ...childRows].reduceRight((item, next) => {
          if (!hash[next.id]) {
            hash[next.id] = item.push(next);
          }
          return item;
        }, []);
        // 返回新的菜单, 并以id进行排序
        return _sortBy(newArr, 'id');
      });
      setSelectedRows(arr => {
        const hash = {};
        // 取原始数据与新选择的数的并集,并对数组去重
        const newArr = parentArr
          .concat(arr.filter(v => !parentArr.includes(v.id)))
          .reduceRight((item, next) => {
            if (!hash[next.id]) {
              hash[next.id] = item.push(next);
            }
            return item;
          }, []);
        // 返回新的菜单, 并以id进行排序
        return _sortBy(newArr, 'id');
      });
      return;
    }
    if (!flag) {
      const parentArr = [];
      parentArr.push(rows);
      findChildMenu(allMenuList, rows.id, parentArr);
      setClickExpandedRows(arr => {
        const hash = {};
        // 取原始数据与新选择的数的并集,并对数组去重
        const newArr = [...arr, ...parentArr].reduceRight((item, next) => {
          if (!hash[next.id]) {
            hash[next.id] = item.push(next);
          }
          return item;
        }, []);
        // 返回新的菜单, 并以id进行排序
        return _sortBy(newArr, 'id');
      });
      setSelectedRows(arr => {
        console.log();
        // 找到取消的所有子节点. 取原始选中菜单不包含该子节点数组的差集
        return arr.filter(v => !parentArr.filter(o => o.id === v.id).length > 0);
      });
    }
  };
  const columns = [
    TableColumnHelper.genPlanColumn('name', '功能名称', { align: 'left' }),
    {
      title: '权限',
      width: 100,
      align: 'center',
      render: rows => {
        const isChecked = !isEmpty(selectedRows.find(v => v.id === rows.id));
        return (
          <Checkbox checked={isChecked} onClick={e => handleChangeCheck(e.target.checked, rows)} />
        );
      },
    },
  ];

  // 递归序列初始化所有菜单树
  const generateAllMenu = (menuArray, pid = 0) => {
    const menuJson = _filter(menuArray, o => String(o.pid) === String(pid));
    if (menuJson.length === 0) {
      return null;
    }
    const menu = _sortBy(menuJson, 'id').map(item => {
      const menuItem = {
        id: item.id,
        key: item.id,
        pid: item.pid,
        url: item.url,
        icon: item.icon,
        name: item.name,
        title: item.name,
        perms: item.perms,
        type: item.type,
      };
      const childMenu = generateAllMenu(menuArray, item.id);
      if (childMenu != null) menuItem.children = childMenu;
      return menuItem;
    });
    return menu;
  };

  console.log(clickExpandedRows, 'clickExpandedRows');
  return (
    <StandardTable
      rowKey="id"
      expandedRowKeys={clickExpandedRows.map(v => v.id)}
      onExpand={(expanded, record) => {
        if (expanded) {
          const newArr = _filter(allMenuList, o => String(o.pid) === String(record.id));
          setExpandedRow(arr => [...arr, ...newArr, record]);
          setClickExpandedRows(arr => [...arr, record]);
          return;
        }
        const parentArr = [];
        parentArr.push(record);
        findChildMenu(allMenuList, record.id, parentArr);
        setExpandedRow(arr => {
          // 找到取消的所有子节点. 取原始选中菜单不包含该子节点数组的差集
          console.log();
          return arr.filter(v => !parentArr.filter(o => o.id === v.id).length > 0);
        });
        setClickExpandedRows(arr =>
          arr.filter(v => !parentArr.filter(o => o.id === v.id).length > 0),
        );
      }}
      // expandIcon={props => {
      //   if (isEmpty(props.record.children)) return '  ';
      //   return props.expanded ? '-' : "+"
      // }}
      data={{ list: generateAllMenu(allMenuList) }}
      columns={columns}
      pagination={false}
    />
  );
});

export default Index;

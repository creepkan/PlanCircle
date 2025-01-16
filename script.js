const yearSelect = document.getElementById('year-select');
const monthSelect = document.getElementById('month-select');
const calendarTable = document.querySelector('#calendar-table tbody');

// 全局保存选中日期
const selectedDates = new Set();

// ---------- 新增：从 localStorage 读取已选日期 ----------
const storedDates = localStorage.getItem('selectedDates');
if (storedDates) {
  try {
    const parsedDates = JSON.parse(storedDates);
    if (Array.isArray(parsedDates)) {
      parsedDates.forEach(date => selectedDates.add(date));
    }
  } catch (error) {
    // 如果解析出错，最好清掉或忽略
    console.error("localStorage 数据解析失败:", error);
    localStorage.removeItem('selectedDates');
  }
}

// 创建年份和月份选择框
function populateYearAndMonth() {
  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 10; i <= currentYear + 10; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    yearSelect.appendChild(option);
  }
  yearSelect.value = currentYear;

  const months = [
      'January 一月', 'February 二月', 'March 三月', 'April 四月',
      'May 五月', 'June 六月', 'July 七月', 'August 八月',
      'September 九月', 'October 十月', 'November 十一月', 'December 十二月'
  ];
  months.forEach((month, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = month;
      monthSelect.appendChild(option);
  });
  monthSelect.value = new Date().getMonth();
}

// 生成日历
function generateCalendar(year, month) {
  // 清空表格内容
  calendarTable.innerHTML = '';

  // 获取当月第一天是星期几
  const firstDay = new Date(year, month, 1).getDay();
  // 获取当月总天数
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let row = document.createElement('tr');

  // 补齐空白单元格
  for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement('td');
      row.appendChild(emptyCell);
  }

  // 从1号到最后一天
  for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement('td');
      cell.textContent = day;

      const dateKey = `${year}-${month + 1}-${day}`;

      // 如果日期已选中，添加样式
      if (selectedDates.has(dateKey)) {
          cell.classList.add('selected');
      }

      // 点击事件
      cell.addEventListener('click', () => toggleDateSelection(cell, dateKey));

      row.appendChild(cell);

      // 每周结束换行
      if ((firstDay + day) % 7 === 0) {
          calendarTable.appendChild(row);
          row = document.createElement('tr');
      }
  }

  // 如果最后一行不满，也要加进去
  if (row.childNodes.length > 0) {
      calendarTable.appendChild(row);
  }
}

// 处理日期选中与取消
function toggleDateSelection(cell, dateKey) {
  if (selectedDates.has(dateKey)) {
    // 已选中 -> 移除
    selectedDates.delete(dateKey);
    cell.classList.remove('selected');
  } else {
    // 未选中 -> 添加
    selectedDates.add(dateKey);
    cell.classList.add('selected');
  }

  // ---------- 新增：更新 localStorage ----------
  localStorage.setItem('selectedDates', JSON.stringify(Array.from(selectedDates)));
}

// 初始化日历
yearSelect.addEventListener('change', () => {
  generateCalendar(Number(yearSelect.value), Number(monthSelect.value));
});

monthSelect.addEventListener('change', () => {
  generateCalendar(Number(yearSelect.value), Number(monthSelect.value));
});

// 初始化年份、月份下拉框
populateYearAndMonth();

// 默认生成当前年份、当前月份
generateCalendar(new Date().getFullYear(), new Date().getMonth());

---
name: 报告问题 / Report a problem
description: 报告条目错误、链接失效或脚本问题
title: "[Fix] "
labels: ["correction"]
body:
  - type: dropdown
    id: kind
    attributes:
      label: 问题类型 / Kind of issue
      options:
        - 链接失效 / Dead link
        - 许可证写错了 / Wrong license
        - 工具已归档或停止维护 / Archived or unmaintained
        - 说明不准确 / Inaccurate description
        - 分类放错了 / Wrong category
        - 校验脚本报错 / Validator bug
        - 其他 / Other
    validations:
      required: true

  - type: input
    id: location
    attributes:
      label: 涉及的文件 / File
      placeholder: docs/general/search.md
    validations:
      required: true

  - type: textarea
    id: detail
    attributes:
      label: 具体问题 / Details
      description: |
        如果链接失效，粘贴完整的 404 页面或错误信息。
        如果是许可证错误，给出仓库 LICENSE 文件的链接。
    validations:
      required: true

  - type: textarea
    id: suggestion
    attributes:
      label: 建议的修正 / Suggested fix
    validations:
      required: false

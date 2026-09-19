![工作坊完成徽章](https://img.shields.io/badge/GitHub_Copilot_實戰工作坊-已完成-1F883D?style=for-the-badge&logo=githubcopilot&logoColor=white)

# 待辦清單 Web App

這是一個在 GitHub Copilot 實戰工作坊中完成的待辦清單 Web App，目標是展示如何在純前端環境中，使用 HTML、CSS 和原生 JavaScript 快速建立一個可使用的任務管理工具。

## 線上展示

https://tonytakop.github.io/20260919-copilot-workshop/

> 這個網址先作為佔位連結，實際部署後可由使用者自行替換成 GitHub Pages 的正式網址。

## 功能

- 新增待辦事項
- 刪除單一待辦事項
- 勾選或取消勾選已完成狀態
- 依照狀態篩選待辦事項
  - 全部
  - 未完成
  - 已完成
- 顯示未完成數量
- 深色模式 / 淺色模式切換
- 清除所有已完成事項
- 在篩選結果為空時顯示清楚的空狀態提示
- 資料使用 localStorage 持久化儲存，重新整理後不會遺失

## 技術

這個專案使用的是純前端技術：

- HTML：結構與內容
- CSS：版面設計與主題樣式
- 原生 JavaScript：互動邏輯、資料更新與畫面渲染
- 無框架
- 無套件
- 無外部 CDN
- 資料儲存在 browser 的 localStorage 中，讓待辦清單具備基本的本地持久化能力

## 開發方式

這個專案是透過 GitHub Copilot 的 Agent Mode、MCP，以及 `.github/prompts` 中的 agentic workflow 來完成的。

- Agent Mode 協助從需求出發，逐步建立前端功能與介面
- MCP 讓開發過程可直接查詢官方文件與 GitHub issue，減少資訊斷層
- `.github/prompts` 中的 prompt 流程用來規範任務執行順序、檢查條件與驗證步驟
- 每個 issue 都依照既定流程進行：讀取需求、提出計畫、修改程式、驗證結果、提交與建立 PR

這樣的方式讓專案開發流程更有結構，也使得修正與功能新增更容易被追蹤與檢視。

## 我學到什麼

- GitHub Copilot 可以協助從需求拆解到實作，並配合專案流程執行
- 以純前端方式開發時，對可用性與互動細節的注意力非常重要
- MCP 能讓 AI 更容易接觸到官方文件與專案上下文，提高探索與修正效率
- 有明確的 prompt 與規範後，協作流程會更穩定，也更容易保持一致性
- 專案中的細節，例如空狀態提示、確認對話框與資料持久化，會直接影響使用者體驗

---

這份作品集內容只整理這個專案目前已完成的成果與開發方式，重點放在真實可驗證的功能與流程說明。

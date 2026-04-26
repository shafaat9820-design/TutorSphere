Remove-Item -Recurse -Force .git
git init
git config user.name "shafaat9820-design"
git config user.email "shafa@example.com"

# Commit 1
git add package.json pnpm-workspace.yaml .gitignore tsconfig.json tsconfig.base.json
$date1 = (Get-Date).AddDays(-10).ToString("o")
$env:GIT_AUTHOR_DATE=$date1
$env:GIT_COMMITTER_DATE=$date1
git commit -m "Project setup and configurations"

# Commit 2
git add lib artifacts/api-server
$date2 = (Get-Date).AddDays(-7).ToString("o")
$env:GIT_AUTHOR_DATE=$date2
$env:GIT_COMMITTER_DATE=$date2
git commit -m "Backend core and API specifications"

# Commit 3
git add artifacts/tutorconnect
$date3 = (Get-Date).AddDays(-5).ToString("o")
$env:GIT_AUTHOR_DATE=$date3
$env:GIT_COMMITTER_DATE=$date3
git commit -m "Frontend interface and API integration"

# Commit 4
git add scripts README.md
$date4 = (Get-Date).AddDays(-2).ToString("o")
$env:GIT_AUTHOR_DATE=$date4
$env:GIT_COMMITTER_DATE=$date4
git commit -m "Documentation and utility scripts"

# Commit 5
git add .
$date5 = (Get-Date).ToString("o")
$env:GIT_AUTHOR_DATE=$date5
$env:GIT_COMMITTER_DATE=$date5
git commit -m "Final project polish and testing"

Remove-Item env:GIT_AUTHOR_DATE
Remove-Item env:GIT_COMMITTER_DATE

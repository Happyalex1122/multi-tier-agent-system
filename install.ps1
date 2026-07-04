param(
  [string]$Target = (Get-Location).Path,
  [string[]]$Only = @(),
  [switch]$All,
  [switch]$DryRun,
  [switch]$Force
)

$package = 'github:Happyalex1122/multi-tier-agent-system'
$surfaces = @('codex', 'claude', 'antigravity', 'cursor', 'windsurf', 'cline', 'copilot', 'opencode', 'openclaw')

function Show-SelectionMenu {
  Write-Host ''
  Write-Host 'multi-tier-agent-system installer' -ForegroundColor Cyan
  Write-Host 'Select surfaces to install:'
  for ($i = 0; $i -lt $surfaces.Count; $i++) {
    $num = $i + 1
    Write-Host ("  {0}. {1}" -f $num, $surfaces[$i])
  }
  Write-Host '  a. all'
  Write-Host '  c. cancel'

  $choice = Read-Host 'Enter selection (e.g. 1,3,9 or a)'
  if ([string]::IsNullOrWhiteSpace($choice)) { return $surfaces }
  $choice = $choice.Trim().ToLowerInvariant()
  if ($choice -eq 'a' -or $choice -eq 'all') { return $surfaces }
  if ($choice -eq 'c' -or $choice -eq 'cancel') { return @() }

  $selected = New-Object System.Collections.Generic.List[string]
  foreach ($part in ($choice -split '[,\s]+' | Where-Object { $_ })) {
    if ($part -match '^[0-9]+$') {
      $idx = [int]$part - 1
      if ($idx -ge 0 -and $idx -lt $surfaces.Count) {
        $name = $surfaces[$idx]
        if (-not $selected.Contains($name)) { [void]$selected.Add($name) }
      }
    } elseif ($surfaces -contains $part) {
      if (-not $selected.Contains($part)) { [void]$selected.Add($part) }
    }
  }

  return ,$selected.ToArray()
}

$args = @('-y', $package, '--')

if ($Target) {
  $args += '--target'
  $args += $Target
}

if ($DryRun) {
  $args += '--dry-run'
}

if ($Force) {
  $args += '--force'
}

$selectedSurfaces = @()
if ($Only.Count -gt 0) {
  $selectedSurfaces = $Only
} elseif ($All.IsPresent) {
  $selectedSurfaces = $surfaces
} elseif ($Host.Name -match 'ConsoleHost' -or $Host.UI.RawUI) {
  $selectedSurfaces = Show-SelectionMenu
} else {
  $selectedSurfaces = $surfaces
}

if ($selectedSurfaces.Count -eq 0) {
  Write-Host 'Cancelled.'
  exit 0
}

foreach ($item in $selectedSurfaces) {
  $args += '--only'
  $args += $item
}

& npx @args
exit $LASTEXITCODE

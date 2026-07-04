param(
  [string]$Target = (Get-Location).Path,
  [string[]]$Only = @(),
  [switch]$All,
  [switch]$DryRun,
  [switch]$Force
)

$package = 'github:Happyalex1122/multi-tier-agent-system'
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

$useAll = $true
if ($PSBoundParameters.ContainsKey('All')) {
  $useAll = $All.IsPresent
}
if ($Only.Count -gt 0) {
  $useAll = $false
}

if ($Only.Count -gt 0) {
  foreach ($item in $Only) {
    $args += '--only'
    $args += $item
  }
} elseif ($useAll) {
  $args += '--all'
}

& npx @args
exit $LASTEXITCODE

Add-Type -AssemblyName System.Drawing

function New-CleanImage {
  param(
    [string]$FilePath,
    [int]$Width,
    [int]$Height,
    [string]$Color1,
    [string]$Color2,
    [bool]$WithPulse = $true,
    [string]$PulseColor = "#ffffff"
  )
  $bmp = New-Object System.Drawing.Bitmap($Width, $Height)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $c1 = [System.Drawing.ColorTranslator]::FromHtml($Color1)
  $c2 = [System.Drawing.ColorTranslator]::FromHtml($Color2)
  $rect = New-Object System.Drawing.Rectangle(0, 0, $Width, $Height)
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, 135)
  $g.FillRectangle($brush, $rect)

  # Sutil resplandor radial en la esquina superior derecha
  $glow = New-Object System.Drawing.Drawing2D.GraphicsPath
  $glowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(36, 255, 255, 255))
  $g.FillEllipse($glowBrush, [int]($Width * 0.55), [int](-$Height * 0.25), [int]($Width * 0.9), [int]($Width * 0.9))
  $glowBrush.Dispose()

  if ($WithPulse) {
    # Línea de pulso cardíaco
    $pen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml($PulseColor), [Math]::Max(2, $Width / 300))
    $pts = New-Object System.Collections.Generic.List[System.Drawing.PointF]
    $mid = $Height * 0.62
    $n = [Math]::Min(240, $Width / 6)
    for ($i = 0; $i -le $n; $i++) {
      $x = ($i / $n) * $Width
      $y = $mid
      $phase = ($i / $n) * 6.0
      if ($phase -ge 2.4 -and $phase -le 2.7) {
        $y = $mid - ($Height * 0.30)  # pico alto
      } elseif ($phase -gt 2.7 -and $phase -le 2.9) {
        $y = $mid - ($Height * 0.18)
      } elseif ($phase -gt 2.9 -and $phase -le 3.1) {
        $y = $mid + ($Height * 0.08)
      } elseif ($phase -gt 3.1 -and $phase -le 3.3) {
        $y = $mid - ($Height * 0.22)
      } else {
        $y = $mid + ([Math]::Sin($phase * 0.8) * 6)
      }
      $pts.Add((New-Object System.Drawing.PointF($x, $y)))
    }
    $g.DrawLines($pen, $pts.ToArray())
    $pen.Dispose()
  }

  $g.Dispose()
  $bmp.Save($FilePath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
  $bmp.Dispose()
}

$dir = "C:\Users\admin\Documents\Default Project\dr-henry-pacheco\assets\images"

# Fondo del hero: gradiente oscuro elegante, sin texto
New-CleanImage -FilePath "$dir\hero-neurocirugia.jpg" -Width 1600 -Height 900 -Color1 "#081c33" -Color2 "#0e7490" -WithPulse $true -PulseColor "#7dd3fc"

# Portadas del blog: gradientes a color, sin texto
New-CleanImage -FilePath "$dir\aneurisma-cerebral.jpg" -Width 800 -Height 450 -Color1 "#7f1d1d" -Color2 "#dc2626" -WithPulse $true -PulseColor "#fecaca"
New-CleanImage -FilePath "$dir\acv-accidente-cerebrovascular.jpg" -Width 800 -Height 450 -Color1 "#5b21b6" -Color2 "#8b5cf6" -WithPulse $true -PulseColor "#ddd6fe"
New-CleanImage -FilePath "$dir\neurointervencionismo.jpg" -Width 800 -Height 450 -Color1 "#0c4a6e" -Color2 "#0891b2" -WithPulse $true -PulseColor "#cffafe"
New-CleanImage -FilePath "$dir\prevenir-acv.jpg" -Width 800 -Height 450 -Color1 "#14532d" -Color2 "#16a34a" -WithPulse $true -PulseColor "#bbf7d0"
New-CleanImage -FilePath "$dir\salud-cerebral.jpg" -Width 800 -Height 450 -Color1 "#7c2d12" -Color2 "#ea580c" -WithPulse $true -PulseColor "#fed7aa"
New-CleanImage -FilePath "$dir\investigacion-cerebro.jpg" -Width 800 -Height 450 -Color1 "#3730a3" -Color2 "#6366f1" -WithPulse $true -PulseColor "#e0e7ff"
New-CleanImage -FilePath "$dir\hernia-discal.jpg" -Width 800 -Height 450 -Color1 "#9a3412" -Color2 "#ea580c" -WithPulse $true -PulseColor "#fed7aa"

Write-Output "Imagenes limpias regeneradas."
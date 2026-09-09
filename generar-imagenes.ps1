Add-Type -AssemblyName System.Drawing

function New-PlaceholderImage {
  param(
    [string]$FilePath,
    [int]$Width,
    [int]$Height,
    [string]$Title,
    [string]$SubTitle,
    [string]$Color1 = "#0e7490",
    [string]$Color2 = "#22b8cf",
    [string]$TextColor = "#ffffff"
  )
  $bmp = New-Object System.Drawing.Bitmap($Width, $Height)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $c1 = [System.Drawing.ColorTranslator]::FromHtml($Color1)
  $c2 = [System.Drawing.ColorTranslator]::FromHtml($Color2)
  $rect = New-Object System.Drawing.Rectangle(0, 0, $Width, $Height)
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, 45)
  $g.FillRectangle($brush, $rect)

  $white = [System.Drawing.Brushes]::White
  $alphaBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, 255, 255, 255))
  $g.FillRectangle($alphaBrush, 0, 0, $Width, $Height)

  $fontTitle = New-Object System.Drawing.Font("Segoe UI", [Math]::Max(18, $Width / 22), [System.Drawing.FontStyle]::Bold)
  $fontSub = New-Object System.Drawing.Font("Segoe UI", [Math]::Max(10, $Width / 55), [System.Drawing.FontStyle]::Regular)

  $sfCenter = New-Object System.Drawing.StringFormat
  $sfCenter.Alignment = [System.Drawing.StringAlignment]::Center
  $sfCenter.LineAlignment = [System.Drawing.StringAlignment]::Center

  $rectCenter = New-Object System.Drawing.RectangleF(0, 0, $Width, [float]($Height * 0.55))
  $g.DrawString($Title, $fontTitle, $white, $rectCenter, $sfCenter)

  $rectSub = New-Object System.Drawing.RectangleF(0, [float]($Height * 0.55), $Width, [float]($Height * 0.3))
  $subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 255, 255, 255))
  $g.DrawString($SubTitle, $fontSub, $subBrush, $rectSub, $sfCenter)

  $g.Dispose()
  $bmp.Save($FilePath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
  $bmp.Dispose()
}

$dir = "C:\Users\admin\Documents\Default Project\dr-henry-pacheco\assets\images"
Test-Path -LiteralPath $dir | Out-Null

New-PlaceholderImage -FilePath "$dir\hero-neurocirugia.jpg" -Width 1600 -Height 900 -Title "Neurointervencionismo" -SubTitle "Dr. Henry Pacheco - Neurocirujano" -Color1 "#0a2540" -Color2 "#0e7490"

New-PlaceholderImage -FilePath "$dir\dr-henry-pacheco.jpg" -Width 800 -Height 1000 -Title "Dr. Henry" -SubTitle "Pacheco Fernández Baca" -Color1 "#0e7490" -Color2 "#155e75"

New-PlaceholderImage -FilePath "$dir\aneurisma-cerebral.jpg" -Width 800 -Height 450 -Title "Aneurisma Cerebral" -SubTitle "Diagnóstico y tratamiento endovascular" -Color1 "#7f1d1d" -Color2 "#dc2626"

New-PlaceholderImage -FilePath "$dir\acv-accidente-cerebrovascular.jpg" -Width 800 -Height 450 -Title "ACV: Actúa RÁPIDO" -SubTitle "El tiempo es cerebro" -Color1 "#8b5cf6" -Color2 "#6d28d9"

New-PlaceholderImage -FilePath "$dir\neurointervencionismo.jpg" -Width 800 -Height 450 -Title "Neurointervencionismo" -SubTitle "Técnicas mínimamente invasivas" -Color1 "#0e7490" -Color2 "#0891b2"

New-PlaceholderImage -FilePath "$dir\prevenir-acv.jpg" -Width 800 -Height 450 -Title "Prevención del ACV" -SubTitle "Protege tu cerebro" -Color1 "#15803d" -Color2 "#16a34a"

New-PlaceholderImage -FilePath "$dir\salud-cerebral.jpg" -Width 800 -Height 450 -Title "Salud Cerebral" -SubTitle "Cuidado de la columna y el cerebro" -Color1 "#b45309" -Color2 "#d97706"

New-PlaceholderImage -FilePath "$dir\investigacion-cerebro.jpg" -Width 800 -Height 450 -Title "Investigación Científica" -SubTitle "Avances en neurocirugía" -Color1 "#4338ca" -Color2 "#4f46e5"

New-PlaceholderImage -FilePath "$dir\hernia-discal.jpg" -Width 800 -Height 450 -Title "Hernia Discal" -SubTitle "Síntomas, diagnóstico y tratamiento" -Color1 "#9a3412" -Color2 "#ea580c"

Write-Output "Placeholder images created."
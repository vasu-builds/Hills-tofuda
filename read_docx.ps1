Add-Type -AssemblyName System.IO.Compression.FileSystem
$docxPath = "C:\Users\Vasu Dev\Downloads\hills-tofuda-v7\hills-tofuda\Hills_Tofuda_Design_PRD (1).docx"
$zip = [System.IO.Compression.ZipFile]::OpenRead($docxPath)
$entry = $zip.Entries | Where-Object { $_.FullName -eq "word/document.xml" }
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$xml = $reader.ReadToEnd()
$reader.Close()
$zip.Dispose()

# Strip XML tags
$text = $xml -replace '<w:p[ >]', "`r`n" -replace '<[^>]+>', ''
$text | Out-File -FilePath "C:\Users\Vasu Dev\Downloads\hills-tofuda-v7\hills-tofuda\PRD.txt" -Encoding utf8
Write-Output "Extraction complete"

<?php
declare(strict_types=1);
/* Manual gift-card submission page. Store this directory outside the public web root in production. */
$storageDir=__DIR__.'/giftcard_submissions'; $uploadDir=$storageDir.'/uploads';
if(!is_dir($uploadDir)) @mkdir($uploadDir,0750,true);
$message=''; $error='';
function clean($v){return trim(preg_replace('/[^\p{L}\p{N}\s@._+()\-]/u','',$v));}
function save_record($r,$dir){$line=json_encode($r,JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE);return $line!==false && file_put_contents($dir.'/submissions.jsonl',$line.PHP_EOL,FILE_APPEND|LOCK_EX)!==false;}
if($_SERVER['REQUEST_METHOD']==='POST'){
  $cause=clean($_POST['cause']??''); $amount=trim($_POST['amount']??''); $card=preg_replace('/\D+/','',$_POST['gift_card_number']??'');
  $files=['receipt'=>$_FILES['receipt']??null,'gift_card_front'=>$_FILES['gift_card_front']??null,'gift_card_back'=>$_FILES['gift_card_back']??null];
  if($cause===''||$card==='')$error='Please select a cause and enter the gift-card number.';
  elseif(strlen($card)<8||strlen($card)>30)$error='Please check the gift-card number and try again.';
  else{
    $allowed=['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp','application/pdf'=>'pdf'];$saved=[];
    foreach($files as $label=>$file){
      if(!$file||($file['error']??4)!==UPLOAD_ERR_OK){$error='Please upload the receipt and clear front/back photos of the card.';break;}
      if(($file['size']??0)>6*1024*1024){$error='Each upload must be 6 MB or smaller.';break;}
      $mime=(new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
      if($label!=='receipt'&&!in_array($mime,['image/jpeg','image/png','image/webp'],true)){$error='Gift-card front and back must be JPG, PNG or WEBP images.';break;}
      if(!isset($allowed[$mime])){$error='The receipt must be a JPG, PNG, WEBP or PDF file.';break;}
      $name=bin2hex(random_bytes(16)).'_'.$label.'.'.$allowed[$mime];
      if(!move_uploaded_file($file['tmp_name'],$uploadDir.'/'.$name)){$error='The server could not save an upload.';break;}
      $saved[$label]=$name;
    }
    if($error===''){
      $record=['id'=>bin2hex(random_bytes(10)),'created_at'=>gmdate('c'),'cause'=>$cause,'amount'=>$amount,'gift_card_number_last4'=>substr($card,-4),'gift_card_number_masked'=>str_repeat('*',max(0,strlen($card)-4)).substr($card,-4),'uploads'=>$saved];
      if(save_record($record,$storageDir))$message='Thank you. Your gift-card submission has been received for review.';else $error='The submission could not be saved. Please try again.';
    }
  }
}
$selectedCause=clean($_GET['cause']??'');
?>
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Manual Gift Card Donation | Total Giving</title><link rel="stylesheet" href="style.css"></head><body>
<header class="site-header"><a class="brand" href="index.html">Total <span>Giving</span></a><nav><a href="index.html">Home</a><a href="help.html">Donate</a></nav></header>
<main class="page narrow"><div class="page-heading"><div class="eyebrow">GIFT CARD • <!--MANUAL REVIEW --> </div><h1>Submit a gift-card donation</h1><p>Enter the card number and provide proof of purchase. <!-- The submission is saved on the server for review. --> </p></div>
<?php if($message): ?><div class="form-alert success-alert"><?=htmlspecialchars($message,ENT_QUOTES,'UTF-8')?></div><?php endif; ?><?php if($error): ?><div class="form-alert error-alert"><?=htmlspecialchars($error,ENT_QUOTES,'UTF-8')?></div><?php endif; ?>
<form class="giftcard-form" method="post" enctype="multipart/form-data"><label>Donation cause<select name="cause" required><option value="">Select a cause</option><?php foreach(['Food & Basic Needs','Feed Orphanage & Children’s Home','Medical Care & Emergency Support','Education Support','Families in Need','Community Projects'] as $c): ?><option <?=($selectedCause===$c?'selected':'')?>><?=htmlspecialchars($c)?></option><?php endforeach; ?></select></label>
<label>Donation amount<input name="amount" type="number" min="1" step="0.01" placeholder="Enter amount"></label>
<label>Gift-card number<input name="gift_card_number" inputmode="numeric" autocomplete="off" placeholder="Enter the card number" required></label>
<!-- <div class="privacy-warning"><strong>Important privacy notice</strong><span>Do not enter or upload a gift-card PIN, security code or other authentication secret. If the back of the card shows a PIN, cover it before taking the photo.</span></div> -->
<label>Purchase receipt<input name="receipt" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" capture="environment" required><small>Upload a clear receipt photo or PDF.</small></label>
<label>Gift card — front<input name="gift_card_front" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" required><small>Take a clear photo of the front of the card.</small></label>
<label>Gift card — back<input name="gift_card_back" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" required><small>Take a clear photo of the back <!--, with any PIN/security code covered. --> </small></label>
<button class="btn primary full" type="submit">Submit Gift Card Donation</button></form><a class="back-link" href="payment.html">← Back to payment methods</a></main><footer>© 2026 Total Giving</footer></body></html>

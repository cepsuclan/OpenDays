<?php
// walking-dog-incident-plan.php with drag-and-drop UI

function esc($s){ return htmlspecialchars($s, ENT_QUOTES|ENT_SUBSTITUTE, 'UTF-8'); }

$subtasks = [
    'Pre-walk Preparation' => [],
    'Route & Timing' => [],
    'Dog Control & Behaviour' => [],
    'Human Safety' => [],
    'Emergency Response' => [],
    'Post-walk' => [],
];

$allActivities = [
    'Check weather forecast',
    'Inspect leash/collar/harness',
    'Pack water and bowl',
    'Bring poop bags',
    'Carry first-aid kit',
    'Make sure ID tag/microchip up-to-date',
    'Choose familiar route',
    'Avoid high-traffic times',
    'Plan alternative route',
    'Note nearest vet and emergency animal clinic',
    'Use short leash in traffic',
    'Keep dog on left/right as preferred',
    'Carry treats for positive reinforcement',
    'Know signs of stress/aggression',
    'Wear reflective clothing at night',
    'Keep phone charged and accessible',
    'Walk with a partner if possible',
    'Carry personal alarm/whistle',
    'Stop, assess injuries',
    'Control bleeding (apply pressure)',
    'Immobilize broken limb if suspected',
    'Call emergency services (999/112) if human injured',
    'Call vet immediately for severe dog injuries',
    'Transport plan to vet/hospital',
    'Log incidents and time/location',
    'Clean/sterilize any wounds',
    'Review and update plan',
];

$defaults = [
    'owner_name' => '',
    'owner_phone' => '',
    'emergency_contact' => '',
    'vet_name' => '',
    'vet_phone' => '',
    'dog_name' => '',
    'notes' => '',
    'options' => $subtasks,
];

$data = array_merge($defaults, $_POST ?: []);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'download') {
    $plan = build_plan_text($data);
    header('Content-Type: text/plain');
    header('Content-Disposition: attachment; filename="walking-dog-incident-plan.txt"');
    echo $plan;
    exit;
}

function build_plan_text($data){
    $lines = [];
    $lines[] = "Incident Response Plan: Walking the Dog";
    $lines[] = "Generated: " . date('Y-m-d H:i');
    $lines[] = "";
    $lines[] = "Owner / Walker";
    $lines[] = "  Name: " . ($data['owner_name'] ?? '');
    $lines[] = "  Phone: " . ($data['owner_phone'] ?? '');
    $lines[] = "  Emergency contact: " . ($data['emergency_contact'] ?? '');
    $lines[] = "";
    $lines[] = "Dog";
    $lines[] = "  Name: " . ($data['dog_name'] ?? '');
    $lines[] = "  Vet: " . ($data['vet_name'] ?? '');
    $lines[] = "  Vet phone: " . ($data['vet_phone'] ?? '');
    $lines[] = "";

    foreach ($data['options'] as $title => $items) {
        $lines[] = "--- $title ---";
        if (!empty($items)){
            foreach ($items as $opt) {
                $lines[] = "[x] " . $opt;
            }
        } else {
            $lines[] = "[ ] No procedures selected";
        }
        $lines[] = "";
    }

    if (!empty($data['notes'])){
        $lines[] = "Additional Notes:";
        $lines[] = $data['notes'];
    }

    return implode("\n", $lines);
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Incident Response Plan — Walking the Dog</title>
  <style>
    body{font-family:Arial,Helvetica,sans-serif;max-width:1200px;margin:20px auto;padding:0 16px;color:#222}
    h1,h2{color:#0b5}
    .grid{display:grid;grid-template-columns:2fr 1fr;gap:20px}
    .card{background:#f7f7f7;padding:14px;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.06)}
    label{display:block;margin-bottom:6px}
    .droppable{min-height:60px;padding:10px;border:2px dashed #ccc;border-radius:6px;background:#fff;margin:10px 0}
    .activity{padding:6px 10px;margin:4px 0;background:#e6f5ec;border-radius:4px;cursor:grab}
    .dragging{opacity:0.5}
    .summary pre{white-space:pre-wrap;background:#111;color:#fff;padding:12px;border-radius:6px}
    .btn{display:inline-block;padding:8px 12px;border-radius:6px;border:0;cursor:pointer}
    .btn-primary{background:#0b5;color:white}
    .btn-plain{background:#eee}
    input[type="text"], textarea{width:100%;padding:8px;border-radius:6px;border:1px solid #ccc}
  </style>
</head>
<body>
  <h1>Incident Response Plan — Walking the Dog</h1>
  <p>Drag activities from the left list into the subtask sections to build your Incident Response Plan.</p>

  <form method="post" id="planForm">
    <div class="grid">
      <div>
        <div class="card">
          <h2>Case/Incident Details</h2>
          <label>Owner / Walker name
            <input type="text" name="owner_name" value="<?php echo esc($data['owner_name']); ?>">
          </label>
          <label>Owner phone
            <input type="text" name="owner_phone" value="<?php echo esc($data['owner_phone']); ?>">
          </label>
          <label>Emergency contact
            <input type="text" name="emergency_contact" value="<?php echo esc($data['emergency_contact']); ?>">
          </label>
          <label>Dog name
            <input type="text" name="dog_name" value="<?php echo esc($data['dog_name']); ?>">
          </label>
          <label>Vet clinic name
            <input type="text" name="vet_name" value="<?php echo esc($data['vet_name']); ?>">
          </label>
          <label>Vet phone
            <input type="text" name="vet_phone" value="<?php echo esc($data['vet_phone']); ?>">
          </label>
        </div>

        <div class="card">
          <h2>Available Activities</h2>
          <div id="activities">
            <?php foreach ($allActivities as $act): ?>
              <div class="activity" draggable="true" data-value="<?php echo esc($act); ?>"><?php echo esc($act); ?></div>
            <?php endforeach; ?>
          </div>
        </div>

        <div class="card">
          <h2>Notes</h2>
          <textarea name="notes" rows="4"><?php echo esc($data['notes']); ?></textarea>
        </div>

        <div style="margin-top:12px">
          <button class="btn btn-primary" type="submit" name="action" value="preview">Preview Plan</button>
          <button class="btn btn-plain" type="submit" name="action" value="download">Download as .txt</button>
        </div>
      </div>

      <aside>
        <div class="card">
          <h2>Subtasks (drop activities here)</h2>
          <?php foreach ($subtasks as $title => $opts): ?>
            <h3><?php echo esc($title); ?></h3>
            <div class="droppable" data-title="<?php echo esc($title); ?>"></div>
          <?php endforeach; ?>
        </div>
      </aside>
    </div>
  </form>

  <?php if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'preview'): ?>
    <section style="margin-top:18px" class="card summary">
      <h2>Plan Preview</h2>
      <?php echo '<pre>'.esc(build_plan_text($data)).'</pre>'; ?>
    </section>
  <?php endif; ?>

<script>
const activities = document.querySelectorAll('.activity');
let dragged = null;

activities.forEach(act => {
  act.addEventListener('dragstart', e => {
    dragged = act;
    act.classList.add('dragging');
  });
  act.addEventListener('dragend', e => {
    dragged = null;
    act.classList.remove('dragging');
  });
});

document.querySelectorAll('.droppable').forEach(drop => {
  drop.addEventListener('dragover', e => {
    e.preventDefault();
  });
  drop.addEventListener('drop', e => {
    e.preventDefault();
    if(dragged){
      const clone = dragged.cloneNode(true);
      clone.draggable = false;
      clone.classList.remove('dragging');
      drop.appendChild(clone);
      // add hidden input
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = `options[${drop.dataset.title}][]`;
      input.value = dragged.dataset.value;
      drop.appendChild(input);
    }
  });
});
</script>

</body>
</html>

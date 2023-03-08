# MVP for Solana Grizzlython by Soliage team
import os
import json
import numpy as np
import cv2
from skimage import io
from scipy.spatial.distance import cdist
from utils.haze import getRecoverScene

LAMPORTS_PER_SOL = 1_000_000_000

def cluster_colors(img, clusters, debug=False):
    img = io.imread(img)
    pixels = np.float32(img.reshape(-1, 3))
    
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 200, .1)
    flags = cv2.KMEANS_RANDOM_CENTERS
        
    a = 1
    hazed = False
    while a > 0:
        _, labels, palette = cv2.kmeans(pixels, clusters, None, criteria, 10, flags)
        if np.any([sum(i) for i in zip(*palette)] > np.full((1, 3), 300)) and not hazed:
            # print("Clearing haze")
            img = getRecoverScene(img, refine=True)
            pixels = np.float32(img.reshape(-1, 3))
            hazed = True
            continue
        dist = np.tril(cdist(palette, palette, 'euclidean'))
        a = len(sum(np.where(np.logical_and(dist>0, dist<=20))))
        clusters -= 1
        
    _, counts = np.unique(labels, return_counts=True)
    
    rgb_trees = palette[np.argmin(cdist(palette, np.zeros(shape=(1,3)), 'euclidean'))].reshape(1,-1)
    dist = cdist(palette, rgb_trees, 'euclidean')
    selected = np.where(dist<20)
    selected_sum = 0
    for n in selected[0]:
        selected_sum += counts[n]
    return int(selected_sum / sum(counts) * LAMPORTS_PER_SOL)

## Runs from here
directory = os.fsencode('./data/')
f = open(directory.decode("utf-8") + 'tokens.json')
tokens = json.load(f)

resp = []
for id, mintAddress in tokens.items():
    filename = 'images/' + id + '.jpg'
    value = cluster_colors(os.path.join(directory.decode("utf-8"), filename), 5)
    resp.append({
        "id": id,
        "mintAddress": mintAddress,
        "value": value
    })


# resp = []

# for file in os.listdir(directory):
#     filename = os.fsdecode(file)
#     if filename.endswith('.jpg') and filename[0].isdigit():
#         value = cluster_colors(os.path.join(directory.decode("utf-8"), filename), 5)
#         resp.append({
#             "id": filename[0],
#             "mintAddress": tokens[filename[0]]['mintAddress'],
#             "value": value
#         })
#         [] = value
#     else:
#         continue

print(json.dumps(resp))
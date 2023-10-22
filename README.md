# Demo
https://github.com/muxamilian/poor-mans-vr/assets/1943719/e02a5766-1250-4549-bafd-f6f7068f7a8a

Neural networks track the head's position using the front camera and tensorflow.js. The content on the phone changes its position depending on the head's position. The resulting effect is that the phone screen is like a window and the object in the video is seen through the window. 

This is especially useful for ultra-wide videos, which can capture a scene using a wide angle. Viewers can then expercience the scene in a more immersive way because when changing their viewpoint, the content changes its position accordingly. 

# Full screen demo
[https://muxamilian.github.io/poor-mans-vr/](https://muxamilian.github.io/poor-mans-vr/)

# Demo on how to embed into a website (check out source code, very minimalistic)
[https://muxamilian.github.io/poor-mans-vr/index_text.html](https://muxamilian.github.io/poor-mans-vr/index_text.html)

To use this tech on your website, you have to include the js and css files like in the demo above. Then you have to add some divs on your website, which display the content which you want to benefit from the VR effect. Do this according to `index_text.html`. Finally, apply some style to the element(s) with the class `video-to-change`. 

# Discussion

Also check out the [discussion on reddit (r/webdev)](https://www.reddit.com/r/webdev/comments/177pton/a_poor_mans_vr_front_camera_tensorflowjs/). 

# Acknowledgements
Some code is recycled from [https://github.com/justadudewhohacks/face-api.js](https://github.com/justadudewhohacks/face-api.js)
